
import AllSubcategoryTable from "@/components/Admin/Subcategory/AllsubcategoryTable";
import SubCategory from "@/model/SubCategory";
import Category from "@/model/Category";

import React, { Suspense } from "react";
import { connectDB } from "@/lib/mongodb";

async function getAllCategory() {
  await connectDB();
  const categories = await SubCategory.find({})
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(categories));
}

export const dynamic = "force-dynamic";

const AllSubCategory = async () => {
  const category = await getAllCategory();

  return (
    <div>
      <Suspense fallback={<>Loading subcategory.....</>}>
        <AllSubcategoryTable subcategories={category} />
      </Suspense>
    </div>
  );
};

export default AllSubCategory;
