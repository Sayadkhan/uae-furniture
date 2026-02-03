import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import SubCategory from "@/model/SubCategory";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name");
    const desc = formData.get("desc");
    const categoryId = formData.get("category");
    const imageFile = formData.get("image");

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    let imageUrl = "";
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
      imageUrl = uploadRes.secure_url;
    }

    const subCategory = await SubCategory.create({
      name,
      desc,
      image: imageUrl,
      category: categoryId,
    });

    return NextResponse.json(
      { success: true, data: subCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Fetch all subcategories
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let filter = {};
    if (category) {
      filter.category = category;
    }

    const subcategories = await SubCategory.find(filter).populate("category");

    return NextResponse.json({ success: true, data: subcategories });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
