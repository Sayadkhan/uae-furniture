import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProductSlider from "./ProductSlider";

const CategoryProduct = ({ categoryWiseProducts }) => {
  return (
    <div className="space-y-16">
      {categoryWiseProducts.map((category) =>
        category.products.length > 0 ? (
          <div
            key={category._id}
            className="grid grid-cols-1 md:grid-cols-[50%_50%] lg:grid-cols-[30%_70%] gap-3 items-start"
          >
            {/* Left: Category Banner */}
            <div className="relative rounded-2xl overflow-hidden shadow-md w-full h-[200px] md:h-[390px] lg:h-[450px]">
              <Image
                src={category.image || "https://via.placeholder.com/600x600.png"}
                fill
                alt={category.name}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-gray-200 text-sm sm:text-base mb-2 line-clamp-2">
                    {category.description}
                  </p>
                )}
                <p className="text-xs sm:text-sm font-medium text-gray-300 mb-3">
                  {category.products.length} Products
                </p>
                <Link
                  href={`/categories/${category._id}`}
                  className="inline-block bg-black hover:bg-white text-white hover:text-black px-4 py-2 sm:px-5 sm:py-2 rounded-lg font-medium transition duration-300"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Right: Product Slider */}
            <div className="w-full">
              <ProductSlider products={category.products} />
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default CategoryProduct;
