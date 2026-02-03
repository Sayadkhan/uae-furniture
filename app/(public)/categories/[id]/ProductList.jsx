// app/category/[id]/ProductList.jsx
import { Suspense } from "react";
import ProductCard from "./ProductCard";
import { connectDB } from "@/lib/mongodb";
import Product from "@/model/Product";
import Category from "@/model/Category";

export const dynamic = "force-dynamic";

export default async function ProductList({ id }) {
  await connectDB();


  const category = await Category.findById(id).lean();

  const safeCategory = category
    ? {
        ...category,
        _id: category._id.toString(),
        image: category.image || "", 
      }
    : null;

  // ✅ Fetch products under this category
  const products = await Product.find({ category: id })
    .select("_id category subcategory")
    .populate("category", "name")
    .populate("subcategory", "name")
    .lean();

  // Convert product _id to string to avoid JSON issue
  const safeProducts = products.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));

  return (
    <section className="pb-14">

      {/* ✅ Header Banner with Background Image */}
      <div
        className="relative bg-cover bg-center h-64 flex items-center justify-center"
        style={{
          backgroundImage: `url(${safeCategory?.image})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <h2 className="relative text-4xl font-bold text-white px-6 py-3 rounded-lg capitalize z-10">
          {safeCategory?.name}
        </h2>
      </div>

      {/* ✅ If no products found */}
      {safeProducts.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-lg text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {safeProducts.map((p) => (
              <Suspense key={p._id} fallback={<ProductSkeleton />}>
                <ProductCard productId={p._id} />
              </Suspense>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ProductSkeleton() {
  return <div className="animate-pulse bg-gray-200 rounded-xl h-56 shadow-md" />;
}
