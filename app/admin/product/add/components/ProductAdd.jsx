import { Suspense } from "react";

import { connectDB } from "@/lib/mongodb";
import Category from "@/model/Category";
import SubCategory from "@/model/SubCategory";
import ChildCategory from "@/model/ChildCategory";
import AddProductForm from "./AddProductForm";

async function getAllCategoryWithSub() {
  await connectDB();

  const categories = await Category.find({}).sort({ createdAt: -1 }).lean();

  const categoriesWithSubAndChild = await Promise.all(
    categories.map(async (cat) => {
      const subcategories = await SubCategory.find({
        category: cat._id,
      }).lean();

      // attach child categories to each subcategory
      const subcategoriesWithChild = await Promise.all(
        subcategories.map(async (sub) => {
          const childcategories = await ChildCategory.find({
            subcategory: sub._id,
          }).lean();
          return { ...sub, childcategories };
        })
      );

      return { ...cat, subcategories: subcategoriesWithChild };
    })
  );

  return JSON.parse(JSON.stringify(categoriesWithSubAndChild));
}

export const dynamic = "force-dynamic";

export default async function AddProductPage() {
  const categoriesWithSub = await getAllCategoryWithSub();

  return (
    <div className="p-6">
      <Suspense fallback={<p>Loading form...</p>}>
        <AddProductForm categories={categoriesWithSub} />
      </Suspense>
    </div>
  );
}
