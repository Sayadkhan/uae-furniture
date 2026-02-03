import { connectDB } from "@/lib/mongodb";
import Product from "@/model/Product";
import Review from "@/model/Review";

export async function PATCH(req, { params }) {
  await connectDB();
  const { id } = params;
  const { approved } = await req.json();

  const review = await Review.findById(id);
  if (!review)
    return new Response(JSON.stringify({ message: "Review not found" }), {
      status: 404,
    });

  review.approved = approved;
  await review.save();

  // Recalculate product rating
  const reviews = await Review.find({
    product: review.product,
    approved: true,
  });

  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  await Product.findByIdAndUpdate(review.product, {
    averageRating: avg,
    totalReviews: reviews.length,
  });

  return new Response(
    JSON.stringify({
      message: approved
        ? "✅ Review approved successfully."
        : "🚫 Review disapproved.",
    }),
    { status: 200 }
  );
}
