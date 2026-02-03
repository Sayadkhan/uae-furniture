import Image from "next/image";
import Link from "next/link"; // ✅ Import Link

import { connectDB } from "@/lib/mongodb";
import Category from "@/model/Category";
import FeatureCategory from "./Featured/FeatureCategory";
import { Suspense } from "react";

async function getAllCategory() {
  await connectDB();
  const categories = await Category.find({ featured: true })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(categories));
}

export const dynamic = 'force-dynamic';

const FeaturedCategory = async () => {
  const categories = await getAllCategory();

  return (
    <div className="container mx-auto">
        <h3 className="text-[35px] font-semibold text-black mb-5">Feature Category</h3>
    <div>
     <Suspense fallback={<>Getting Data...</>}>
         <FeatureCategory categories={categories}/>
     </Suspense>
    </div>
    </div>
  );
};

export default FeaturedCategory;
