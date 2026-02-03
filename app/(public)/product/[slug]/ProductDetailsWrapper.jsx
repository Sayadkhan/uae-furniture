// app/product/[slug]/ProductDetailsWrapper.jsx

import ProductDetails from "@/components/Product_details_page/ProductDetails";
import { connectDB } from "@/lib/mongodb";
import Product from "@/model/Product";
import Review from "@/model/Review";


export const dynamic = "force-dynamic";

export default async function ProductDetailsWrapper({ slug }) {
  await connectDB();

  // ✅ Fetch product
  const product = await Product.findOne({ slug })
    .populate("category", "name")
    .populate("subcategory", "name")
    .lean();

  if (!product) return <p>Product not found.</p>;

  // ✅ Fetch approved reviews separately
  const reviews = await Review.find({
    product: product?._id,
    approved: true,
  })
    .sort({ createdAt: -1 }) 
    .lean();

  return (
    <ProductDetails
      product={JSON.parse(JSON.stringify(product))}
      reviews={JSON.parse(JSON.stringify(reviews))}
    />
  );
}
