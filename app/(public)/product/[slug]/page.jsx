// app/product/[slug]/page.jsx
import React, { Suspense } from "react";
import ProductDetailsWrapper from "./ProductDetailsWrapper";
import { connectDB } from "@/lib/mongodb";
import Product from "@/model/Product";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug }).lean();

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description?.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.substring(0, 160),
      images: [
        {
          url: product.images?.[0] || product.image || '/og-image.jpg',
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  return (
    <div className="container mx-auto min-h-screen p-6">
      {/* Product Info */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetailsWrapper slug={slug} />
      </Suspense>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-gray-200 h-64 w-full" />
  );
}

