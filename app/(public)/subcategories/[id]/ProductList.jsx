// app/category/[id]/ProductList.jsx
import { connectDB } from "@/lib/mongodb";
import Product from "@/model/Product";
import { Suspense } from "react";
import ProductCard from "./ProductCard";
import Category from "@/model/Category";
import SubCategory from "@/model/SubCategory";

export default async function ProductList({ id }) {
  await connectDB();

  const products = await Product.find({ subcategory: id })
    .select("_id category subcategory")
    .populate("category", "name")
    .populate("subcategory", "name")
    .lean();

  if (!products || products.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg text-gray-500">No products found.</p>
      </div>
    );
  }

  const categoryName = products[0]?.category?.name || "Category";
  const subCategoryName = products[0]?.subcategory?.name || "Products";

  return (
    <section className="py-10">
      {/* Stylish Header */}
      <div className="mb-10">
        {/* Breadcrumb Style */}
        <p className="text-sm text-gray-500">
          {categoryName} <span className="mx-2">/</span> {subCategoryName}
        </p>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">
          {subCategoryName}
        </h1>
        <p className="text-gray-500 mt-2">
          Browse our collection of {subCategoryName} under {categoryName}
        </p>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Suspense key={p._id} fallback={<ProductSkeleton />}>
              <ProductCard productId={p._id.toString()} />
            </Suspense>
          ))}
        </div>
      </div>
    </section>
  );
}

// Skeleton Loader
function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 rounded-xl h-56 shadow-md" />
  );
}
