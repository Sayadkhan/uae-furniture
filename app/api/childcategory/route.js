import { connectDB } from "@/lib/mongodb";
import ChildCategory from "@/model/ChildCategory";
import SubCategory from "@/model/SubCategory";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const subcategory = searchParams.get("subcategory");

    let filter = {};
    if (subcategory) {
      filter.subcategory = subcategory; // filter by subcategory
    }

    const childCategories = await ChildCategory.find(filter)
      .populate("category", "name")
      .populate("subcategory", "name");

    return NextResponse.json({ success: true, data: childCategories });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // name, category, subCategory

    const { name, subCategory, category } = body; // ✅ match schema

    if (!name || !subCategory || !category) {
      return new Response(
        JSON.stringify({
          error: "Name, SubCategory and Category are required",
        }),
        { status: 400 }
      );
    }

    // Ensure SubCategory exists
    const subCat = await SubCategory.findById(subCategory);

    if (!subCat) {
      return new Response(JSON.stringify({ error: "SubCategory not found" }), {
        status: 404,
      });
    }

    const childCategory = await ChildCategory.create({
      name,
      category,
      subcategory: subCategory,
    });

    return new Response(JSON.stringify(childCategory), { status: 201 });
  } catch (err) {
    console.log(err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
