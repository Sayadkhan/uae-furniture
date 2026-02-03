import { connectDB } from "@/lib/mongodb";
import Category from "@/model/Category";

export async function PATCH(req, { params }) {
  try {
    await connectDB(); // Make sure your MongoDB connection works

    const { id } = await params;
    const body = await req.json();

    // Find category by ID and update the fields sent in the request
    const updatedCategory = await Category.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedCategory) {
      return new Response(JSON.stringify({ message: "Category not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedCategory), { status: 200 });
  } catch (error) {
    console.error("PATCH Category Error:", error);
    return new Response(JSON.stringify({ message: "Server Error" }), {
      status: 500,
    });
  }
}
