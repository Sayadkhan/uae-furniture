import { connectDB } from "@/lib/mongodb";
import ChildCategory from "@/model/ChildCategory";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const deletedCategory = await ChildCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return new Response(
        JSON.stringify({ message: "ChildCategory not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ message: "ChildCategory deleted" }), {
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
