import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import Category from "@/model/Category";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const desc = formData.get("desc");
    const imageFile = formData.get("image");
    const iconFile = formData.get("icon");

    // ✅ Update basic fields
    if (name) category.name = name;
    if (desc) category.desc = desc;

    // ✅ Handle image upload
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
      });
      category.image = uploadRes.secure_url;
    }

    // ✅ Handle icon upload
    if (iconFile && iconFile.size > 0) {
      const buffer = Buffer.from(await iconFile.arrayBuffer());
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories/icons" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
      });
      category.icon = uploadRes.secure_url;
    }

    await category.save();

    return NextResponse.json(
      { success: true, data: category },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return new Response(JSON.stringify({ message: "Category not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Category deleted" }), {
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
