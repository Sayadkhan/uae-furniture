import { connectDB } from "@/lib/mongodb";
import SocialMedia from "@/model/SocialMedia";
import { NextResponse } from "next/server";

// ✅ PATCH: Update "show" status
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { show } = await req.json();

    const updated = await SocialMedia.findByIdAndUpdate(
      id,
      { show },
      { new: true }
    );

    if (!updated)
      return NextResponse.json({ success: false, message: "Not found" });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Update failed" });
  }
}

// ✅ DELETE: Remove a link
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    await SocialMedia.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Delete failed" });
  }
}
