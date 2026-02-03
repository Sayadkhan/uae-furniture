// /api/products/[id]/review/route.js

import { connectDB } from "@/lib/mongodb";
import Product from "@/model/Product";
import Review from "@/model/Review";

export async function POST(req, { params }) {
  await connectDB();

  const { id } = await params;
  const { name, email, rating, comment, userId } = await req.json();

  const product = await Product.findById(id);
  if (!product)
    return new Response(JSON.stringify({ message: "Product not found" }), {
      status: 404,
    });

  // Create review separately
  const review = await Review.create({
    product: id,
    user: userId || null,
    name,
    email,
    rating,
    comment,
    approved: false,
  });

  // Add review ID to product
  product.reviews.push(review._id);
  await product.save();

  return new Response(
    JSON.stringify({
      message: "Review submitted successfully, waiting for admin approval.",
    }),
    { status: 200 }
  );
}
