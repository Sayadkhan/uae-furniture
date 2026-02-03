import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import Banner from "@/model/Banner";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const formData = await req.formData();

    const title = formData.get("title");
    const subtitle = formData.get("subtitle");
    const description = formData.get("description");
    const link = formData.get("link");
    const imageFile = formData.get("image");

    let updateData = { title, subtitle, description, link };

    // If image uploaded, replace old one
    if (imageFile && imageFile.name) {
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

      updateData.image = uploadedImage.secure_url;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return new Response(JSON.stringify(updatedBanner), { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to update banner" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const banner = await Banner.findById(id);
    if (!banner)
      return new Response(JSON.stringify({ message: "Banner not found" }), {
        status: 404,
      });

    await Banner.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ message: "Banner deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete banner" }),
      { status: 500 }
    );
  }
}
