// /api/reviews/[id]/approve/route.js

import { connectDB } from "@/lib/mongodb";
import Product from "@/model/Product";
import Review from "@/model/Review";

export async function PUT(req, { params }) {
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
        ? "Review approved successfully."
        : "Review disapproved.",
    }),
    { status: 200 }
  );
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const review = await Review.findById(id);
    if (!review)
      return new Response(JSON.stringify({ message: "Review not found" }), {
        status: 404,
      });

    const productId = review.product;

    // Delete review
    await review.deleteOne();

    // Remove review ID from product.reviews array
    await Product.findByIdAndUpdate(productId, {
      $pull: { reviews: id },
    });

    // Recalculate product rating
    const reviews = await Review.find({ product: productId, approved: true });
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    await Product.findByIdAndUpdate(productId, {
      averageRating: avg,
      totalReviews: reviews.length,
    });

    return new Response(
      JSON.stringify({ message: "Review deleted successfully." }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Failed to delete review." }),
      { status: 500 }
    );
  }
}
