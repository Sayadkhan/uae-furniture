// app/category/[id]/ProductCard.jsx

import ShopCard from "@/components/Shop_Page/ShopCard";
import { connectDB } from "@/lib/mongodb";
import Product from "@/model/Product";


export default async function ProductCard({ productId }) {
  await connectDB();

  const product = await Product.findById(productId)
    .populate("category", "name")
    .populate("subcategory", "name")
    .lean();

  if (!product) return null;

  return <ShopCard product={JSON.parse(JSON.stringify(product))} />;
}
