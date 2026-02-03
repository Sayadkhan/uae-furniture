"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, PhoneCall, MessageCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  Keyboard,
  Zoom,
  Mousewheel,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import "swiper/css/effect-fade";
import BookedSection from "@/components/Home_page/BookedSection/BookedSetion";
import ShopCard from "@/components/Shop_Page/ShopCard";

const CurtainsProduct = ({ products, subCategoy }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const swiperRef = useRef(null);

  const openLightbox = (product) => {
    setSelectedProduct(product);
  };

  const closeLightbox = () => {
    setSelectedProduct(null);
  };

  // ✅ Double click zoom toggle
  const handleDoubleClick = () => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;
    const zoom = swiper.zoom;
    if (zoom.scale && zoom.scale > 1) {
      zoom.out();
    } else {
      zoom.in();
    }
  };

  // ✅ ESC key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    };
    if (selectedProduct) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProduct]);

  return (
    <>
      <div className="container mx-auto">

      <div
        className="relative bg-cover bg-center h-64 flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage: `url(${subCategoy.image})`,
        }}
      >
        {/* Overlay dark shade for text visibility */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white capitalize">
            {subCategoy.name}
          </h2>

          {subCategoy?.desc && (
            <p className="text-white text-lg mt-2 max-w-2xl">
              {subCategoy.desc}
            </p>
          )}
        </div>
      </div>


        {/* Booked Section */}
        <div>
          <BookedSection />
        </div>

       {/* 🖼 Product Slider */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-10">
     
            {products?.map((product) => (
              <div key={product._id}>
                  <ShopCard product={product}/>    
              </div>
            ))}
  
        </div>
 
      </div>

      {/* 🔍 Lightbox Viewer */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onDoubleClick={handleDoubleClick}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white hover:text-gray-300 transition"
          >
            <X size={32} />
          </button>

          {/* Swiper inside Lightbox */}
          <div className="relative w-[90vw] max-w-5xl h-[80vh]">
            <Swiper
              ref={swiperRef}
              modules={[
                Navigation,
                Pagination,
                Keyboard,
                Zoom,
                Mousewheel,
                EffectFade,
              ]}
              navigation
              pagination={{ clickable: true }}
              keyboard={{ enabled: true }}
              zoom={{ maxRatio: 3 }}
              mousewheel={{ forceToAxis: true, sensitivity: 1 }}
              effect="fade"
              className="h-full"
            >
              {selectedProduct.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="swiper-zoom-container flex items-center justify-center w-full h-full">
                    <Image
                      src={img}
                      alt={`Product image ${i + 1}`}
                      fill
                      className="object-contain rounded-xl select-none"
                      draggable={false}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default CurtainsProduct;
