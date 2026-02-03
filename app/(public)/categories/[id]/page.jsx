// app/category/[id]/page.jsx
import React, { Suspense } from "react";
import ProductList from "./ProductList";


export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
  const { id } = await params;

  return (
    <div className="container mx-auto min-h-screen p-6">     
      <Suspense fallback={<LoadingSkeleton />}>
        <ProductList id={id} />
      </Suspense>
    </div>
  );
}

// A simple skeleton or spinner while loading
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 rounded-xl h-40"
        />
      ))}
    </div>
  );
}
