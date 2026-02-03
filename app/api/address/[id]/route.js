import { connectDB } from "@/lib/mongodb";
import Address from "@/model/Address";
import { NextResponse } from "next/server";

// ✅ Edit address
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await req.json();

    const updated = await Address.findByIdAndUpdate(id, data, { new: true });
    if (!updated)
      return NextResponse.json({
        success: false,
        message: "Address not found",
      });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /api/address/[id] error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update address",
    });
  }
}

// ✅ (Optional) Delete address
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    await Address.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/address/[id] error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to delete address",
    });
  }
}
