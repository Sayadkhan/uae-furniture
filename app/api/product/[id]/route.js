import { connectDB } from "@/lib/mongodb";
import Product from "@/model/Product";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// helper function to upload a single file buffer
async function uploadToCloudinary(file, folder) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      })
      .end(buffer);
  });
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const formData = await req.formData();

    // Basic fields
    const body = Object.fromEntries(formData.entries());

    // Parse oldImages and variants
    body.oldImages = JSON.parse(body.oldImages || "[]");
    body.variants = JSON.parse(body.variants || "[]");

    // ✅ Remove empty string ObjectId fields
    if (!body.childcategory || body.childcategory === "") {
      body.childcategory = null;
    }

    // Handle main images upload
    const mainImagesFiles = formData.getAll("images");
    const mainImageUrls = [];
    for (const file of mainImagesFiles) {
      const uploaded = await uploadToCloudinary(file, "products");
      mainImageUrls.push(uploaded.secure_url);
    }
    body.images = [...body.oldImages, ...mainImageUrls];

    // Handle variant images
    for (let i = 0; i < body.variants.length; i++) {
      const variantFiles = formData.getAll(`variantImages_${i}`);
      const variantUrls = [];
      for (const file of variantFiles) {
        const uploaded = await uploadToCloudinary(file, "products/variants");
        variantUrls.push(uploaded.secure_url);
      }
      body.variants[i].images = [
        ...(body.variants[i].oldImages || []),
        ...variantUrls,
      ];
    }

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product updated successfully", product },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating product", error: error.message },
      { status: 500 }
    );
  }
}

// ✅ Delete product
export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting product", error: error.message },
      { status: 500 }
    );
  }
}
