import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { writeFile } from "fs/promises";
import path from "path";
import SocialMedia from "@/model/SocialMedia";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const platform = formData.get("platform");
    const url = formData.get("url");
    const iconFile = formData.get("icon");

    if (!platform || !url) {
      return NextResponse.json(
        { success: false, message: "Platform and URL are required" },
        { status: 400 }
      );
    }

    let iconPath = "";
    if (iconFile && iconFile.size > 0) {
      const buffer = Buffer.from(await iconFile.arrayBuffer());
      const filename = `${Date.now()}-${iconFile.name.replace(/\s+/g, "_")}`;
      const uploadPath = path.join(
        process.cwd(),
        "public/uploads/social",
        filename
      );

      await writeFile(uploadPath, buffer);
      iconPath = `/uploads/social/${filename}`;
    }

    const newSocial = await SocialMedia.create({
      platform,
      url,
      icon: iconPath,
    });

    return NextResponse.json({ success: true, data: newSocial });
  } catch (error) {
    console.error("Error creating social media link:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const links = await SocialMedia.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    console.error("Error fetching social links:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
