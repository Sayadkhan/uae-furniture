import { connectDB } from "@/lib/mongodb";
import Address from "@/model/Address";
import { NextResponse } from "next/server";

// ✅ Add new address
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const newAddress = await Address.create(data);

    return NextResponse.json({ success: true, data: newAddress });
  } catch (error) {
    console.error("POST /api/address error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to add address",
    });
  }
}

// ✅ Fetch all addresses
export async function GET() {
  try {
    await connectDB();
    const addresses = await Address.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: addresses });
  } catch (error) {
    console.error("GET /api/address error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
}
