"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { formatCurrency } from "@/lib/formatCurrency";

const ProductSlider = ({ products }) => {
  if (!products || products.length === 0) {
    return <p className="text-gray-500 italic">No products in this category</p>;
  }

  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 1 },
        1024: { slidesPerView: 3 },
      }}
      navigation
      className="pb-10"
    >
      {products.map((product) => {
        // calculate discounted price
        let finalPrice = product.price;

        if (product.discountType === "percentage") {
          finalPrice = product.price - (product.price * product.discount) / 100;
        } else if (product.discountType === "fixed") {
          finalPrice = product.price - product.discount;
        }

        return (
          <SwiperSlide key={product._id}>
            <div className="p-[10px] shadow-2xl rounded-xl group bg-white border-2">
              <div className="w-full h-[200px] md:h-[250px] lg:h-[280px] overflow-hidden rounded-lg">
                <Link href={`/product/${product.slug}`}>
                  <Image
                    src={
                      product.images[0] ||
                      "https://via.placeholder.com/300x200.png?text=No+Image"
                    }
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-125 transition-all duration-300"
                  />
                </Link>
              </div>

              <div className="text-center mt-5">
                <span className="text-[15px] font-normal">{product.name}</span>

                {/* Price display with discount */}
                {finalPrice !== product.price ? (
                  <div className="mt-2 flex items-center justify-center gap-5">
                    <h4 className="text-[18px] font-semibold text-red-600">
                      {formatCurrency(Number(finalPrice.toFixed(2)))}
                    </h4>
                    <p className="text-[14px] text-gray-500 line-through">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                ) : (
                  <h4 className="text-[20px] font-semibold mt-2 text-amber-700">
                    {formatCurrency(product.price)}
                  </h4>
                )}

                {/* Discount label */}
                {product.discountType === "percentage" && (
                  <p className="text-[12px] text-green-600 mt-1">
                    Save {product.discount}%
                  </p>
                )}
                {product.discountType === "fixed" && (
                  <p className="text-[12px] text-green-600 mt-1">
                    Save {formatCurrency(product.discount)}
                  </p>
                )}

                <Link
                  href={`/product/${product.slug}`}
                  className="text-[14px] font-medium px-5 py-2 bg-black text-white block mt-3 rounded-lg hover:bg-gray-800 transition"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ProductSlider;
