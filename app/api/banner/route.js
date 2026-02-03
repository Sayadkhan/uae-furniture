import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import Banner from "@/model/Banner";

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    const title = formData.get("title");
    const subtitle = formData.get("subtitle");
    const description = formData.get("description");
    const link = formData.get("link");
    const imageFile = formData.get("image");

    if (!title || !subtitle || !description || !link || !imageFile) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadedImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "banners" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    const banner = await Banner.create({
      title,
      subtitle,
      description,
      link,
      image: uploadedImage.secure_url,
    });

    return new Response(JSON.stringify(banner), { status: 201 });
  } catch (error) {
    console.error("Banner upload error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(banners), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to fetch banners" }),
      { status: 500 }
    );
  }
}
