import { NextResponse } from "next/server";
import SubCategory from "@/model/SubCategory";
import { connectDB } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return NextResponse.json(
        { error: "SubCategory not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const desc = formData.get("desc");
    const category = formData.get("category");
    const imageFile = formData.get("image");

    // Update values if provided
    if (name) subCategory.name = name;
    if (desc) subCategory.desc = desc;
    if (category) subCategory.category = category;

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "subcategories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });
      subCategory.image = uploadRes.secure_url;
    }

    await subCategory.save();

    return NextResponse.json(
      { success: true, data: subCategory },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const deletedCategory = await SubCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return new Response(
        JSON.stringify({ message: "SubCategory not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ message: "SubCategory deleted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
