import { connectDB } from "@/lib/mongodb";
import Product from "@/model/Product";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    // Only allow updating specific fields
    const updateFields = {};
    if (body.hasOwnProperty("featured")) updateFields.featured = body.featured;
    if (body.hasOwnProperty("newarrivable"))
      updateFields.newarrivable = body.newarrivable;
    if (body.hasOwnProperty("topsell")) updateFields.topsell = body.topsell;

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated", product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
