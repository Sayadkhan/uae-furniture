import { Suspense } from "react";
import { connectDB } from "@/lib/mongodb";
import Category from "@/model/Category";
import CategoryIcons from "./CategoryIcons";


export const dynamic = "force-dynamic";

async function getAllCategory() {
  await connectDB();

  const categories = await Category.find(
    { new_arrivable: true },
    { _id: 1, name: 1, icon: 1 }
  )
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(categories));
}

const NewCategory = async () => {
  const categories = await getAllCategory();

  return (
    <div className="container mx-auto">
      <div>
        <Suspense fallback={<>Getting Data...</>}>
          <CategoryIcons categories={categories} />
        </Suspense>
      </div>
    </div>
  );
};

export default NewCategory;
