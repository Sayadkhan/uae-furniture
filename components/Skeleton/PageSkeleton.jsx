"use client";
import React from "react";

export default function PageSkeleton({ title = "Loading homepage..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Title */}
      <div className="w-48 h-6 bg-gray-200 rounded-md animate-pulse mb-8"></div>

      {/* Hero Skeleton */}
      <div className="w-full max-w-5xl h-64 bg-gray-200 rounded-xl animate-pulse mb-10"></div>

      {/* Category Icons */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 w-full max-w-5xl mb-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-12 h-3 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 w-full max-w-5xl">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 p-3 border border-gray-100 rounded-xl shadow-sm"
          >
            <div className="w-full h-40 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
