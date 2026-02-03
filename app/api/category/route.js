import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import Category from "@/model/Category";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const category = await Category.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, category });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name");
    const desc = formData.get("desc");
    const imageFile = formData.get("image");
    const iconFile = formData.get("icon"); // 👈 new field

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let imageUrl = "";
    let iconUrl = "";

    // ✅ Upload main image
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
      });
      imageUrl = uploadRes.secure_url;
    }

    // ✅ Upload icon image
    if (iconFile && iconFile.size > 0) {
      const buffer = Buffer.from(await iconFile.arrayBuffer());
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories/icons" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
      });
      iconUrl = uploadRes.secure_url;
    }

    // ✅ Create category
    const category = await Category.create({
      name,
      desc,
      image: imageUrl,
      icon: iconUrl,
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
