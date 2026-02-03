import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/model/Logo";

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file)
      return NextResponse.json({ success: false, message: "No file uploaded" });

    const buffer = Buffer.from(await file.arrayBuffer());

    // Ensure folder exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "logo");
    if (!fs.existsSync(uploadsDir))
      fs.mkdirSync(uploadsDir, { recursive: true });

    // Unique filename
    const filename = `logo_${Date.now()}_${file.name}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/logo/${filename}`;

    // Connect DB
    await connectDB();
    const existing = await Logo.findOne();

    // If old logo exists, delete the old file
    if (existing) {
      const oldFilePath = path.join(process.cwd(), "public", existing.imageUrl);
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

      existing.imageUrl = imageUrl;
      await existing.save();
    } else {
      await Logo.create({ imageUrl });
    }

    return NextResponse.json({ success: true, data: { imageUrl } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Upload failed" });
  }
};
// GET: fetch current logo
export const GET = async () => {
  try {
    await connectDB();
    const logo = await Logo.findOne();
    return NextResponse.json({ success: true, data: logo });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch logo",
    });
  }
};

// DELETE: remove logo
export const DELETE = async () => {
  try {
    await connectDB();
    const logo = await Logo.findOne();
    if (!logo)
      return NextResponse.json({ success: false, message: "No logo found" });

    // Delete the file from /public/uploads/logo/
    const filePath = path.join(process.cwd(), "public", logo.imageUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Remove from DB
    await Logo.deleteOne({ _id: logo._id });

    return NextResponse.json({
      success: true,
      message: "Logo deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Failed to delete logo",
    });
  }
};
