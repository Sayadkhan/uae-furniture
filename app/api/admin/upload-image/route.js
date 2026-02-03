import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/model/Admin";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    let arrayBuffer;
    if (typeof file.arrayBuffer === "function") {
      arrayBuffer = await file.arrayBuffer();
    } else if (file.stream) {
      const chunks = [];
      for await (const chunk of file.stream()) chunks.push(chunk);
      arrayBuffer = Buffer.concat(chunks);
    } else {
      throw new Error("Unsupported file type");
    }

    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    // ✅ 4. Find current admin and delete old image from Cloudinary
    const admin = await Admin.findById(decoded.id);
    if (!admin)
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    if (admin.image && admin.image.includes("cloudinary.com")) {
      const publicIdMatch = admin.image.match(
        /\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z]+$/
      );
      if (publicIdMatch && publicIdMatch[1]) {
        const publicId = publicIdMatch[1];
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (deleteErr) {
          console.warn("Failed to delete old image:", deleteErr.message);
        }
      }
    }

    // ✅ 5. Upload new image
    const uploadResponse = await cloudinary.uploader.upload(base64Data, {
      folder: "admin_profiles",
      resource_type: "image",
    });

    // ✅ 6. Update DB
    const updated = await Admin.findByIdAndUpdate(
      decoded.id,
      { profile: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      imageUrl: updated.image,
      message: "Profile image uploaded successfully",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
