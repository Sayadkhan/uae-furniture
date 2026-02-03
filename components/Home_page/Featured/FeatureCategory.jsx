"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import Link from "next/link";
import Image from "next/image";

const FeatureCategory = ({ categories }) => {
  return (
    <div className="overflow-hidden">
      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={20}
        slidesPerView={2} 
        loop={true}
        freeMode={{
          enabled: true,
          momentum: false,
        }}
        autoplay={{
          delay: 1, // almost no delay
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // pause on hover
        }}
        speed={2000} 
        breakpoints={{
          640: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
        }}
        className="my-8"
      >
        {categories.map((category) => (
          <SwiperSlide key={category._id}>
            <div className="w-full h-[220px] sm:h-[280px] md:h-[320px] overflow-hidden rounded-lg relative">
              <Image
                className="w-full h-full object-cover"
                src={category.image}
                width={600}
                height={600}
                alt={category.name}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.4)] flex flex-col justify-center px-6 sm:px-8 md:px-12">
                <h3 className="text-[20px] sm:text-[24px] md:text-[30px] font-semibold text-white leading-[28px] sm:leading-[32px] md:leading-[36px]">
                  {category.name}
                </h3>
                <p className="text-[14px] sm:text-[16px] md:text-[20px] font-normal text-white mt-3">
                  {category.desc || "Discover Unique Finds!"}
                </p>
                <Link
                  href={`/categories/${category._id}`}
                   className="text-[14px] sm:text-[16px] md:text-[20px] text-white px-5 sm:px-6 md:px-7 py-2 sm:py-3 bg-[#000] rounded-md inline-block mt-6 md:mt-8 
                   w-[150px]"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeatureCategory;
