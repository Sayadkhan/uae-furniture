import { connectDB } from "@/lib/mongodb";
import Coupon from "@/model/Coupon";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10))
  );
  const skip = (page - 1) * limit;

  const filter = {};
  if (url.searchParams.get("active") === "true") filter.isActive = true;
  if (url.searchParams.get("code"))
    filter.code = url.searchParams.get("code").toUpperCase();

  const [total, coupons] = await Promise.all([
    Coupon.countDocuments(filter),
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
  ]);

  return NextResponse.json({ data: coupons, meta: { total, page, limit } });
}

// POST /api/coupons
export async function POST(req) {
  await connectDB();
  const body = await req.json();

  // Basic validation
  if (!body.code || !body.discountValue || !body.expiryDate) {
    return NextResponse.json(
      { error: "Missing required fields (code, discountValue, expiryDate)" },
      { status: 400 }
    );
  }

  const payload = {
    code: String(body.code).trim().toUpperCase(),
    discountType: body.discountType === "fixed" ? "fixed" : "percentage",
    discountValue: Number(body.discountValue),
    minPurchase: Number(body.minPurchase || 0),
    expiryDate: new Date(body.expiryDate),
    isActive: Boolean(body.isActive ?? true),
    description: body.description || "",
    usageLimit: Number(body.usageLimit || 0),
  };

  if (
    payload.discountValue < 0 ||
    payload.minPurchase < 0 ||
    payload.usageLimit < 0
  ) {
    return NextResponse.json(
      { error: "Numeric fields cannot be negative" },
      { status: 400 }
    );
  }

  try {
    const existing = await Coupon.findOne({ code: payload.code });
    if (existing)
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 409 }
      );

    const created = await Coupon.create(payload);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
