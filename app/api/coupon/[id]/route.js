import { connectDB } from "@/lib/mongodb";
import Coupon from "@/model/Coupon";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectDB();
  const { id } = params;
  try {
    const coupon = await Coupon.findById(id);
    if (!coupon)
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    return NextResponse.json({ data: coupon });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await connectDB();
  const { id } = params;
  const body = await request.json();

  const updates = {};
  if (body.code) updates.code = String(body.code).trim().toUpperCase();
  if (body.discountType)
    updates.discountType =
      body.discountType === "fixed" ? "fixed" : "percentage";
  if (typeof body.discountValue !== "undefined")
    updates.discountValue = Number(body.discountValue);
  if (typeof body.minPurchase !== "undefined")
    updates.minPurchase = Number(body.minPurchase);
  if (body.expiryDate) updates.expiryDate = new Date(body.expiryDate);
  if (typeof body.isActive !== "undefined")
    updates.isActive = Boolean(body.isActive);
  if (typeof body.description !== "undefined")
    updates.description = body.description;
  if (typeof body.usageLimit !== "undefined")
    updates.usageLimit = Number(body.usageLimit);

  // Basic validation
  if (
    updates.discountValue < 0 ||
    updates.minPurchase < 0 ||
    updates.usageLimit < 0
  ) {
    return NextResponse.json(
      { error: "Numeric fields cannot be negative" },
      { status: 400 }
    );
  }

  try {
    // If code is being changed, ensure uniqueness
    if (updates.code) {
      const duplicate = await Coupon.findOne({
        code: updates.code,
        _id: { $ne: id },
      });
      if (duplicate)
        return NextResponse.json(
          { error: "Coupon code already exists" },
          { status: 409 }
        );
    }

    const updated = await Coupon.findByIdAndUpdate(id, updates, { new: true });
    if (!updated)
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = await params;
  try {
    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    return NextResponse.json({ data: deleted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
