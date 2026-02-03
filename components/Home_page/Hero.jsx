'use client';
import React from 'react';
import '../Home_page/Hero.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay, FreeMode } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';


const Hero = ({banner}) => {

  return (
    <section className="py-6 sm:py-8 lg:py-10 relative">
      <div className="container mx-auto px-3 sm:px-5">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, FreeMode]}
          navigation
          pagination={{ clickable: true }}
          loop
          freeMode
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className="mySwiper rounded-2xl overflow-hidden shadow-lg"
        >
          {banner.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative flex flex-col md:flex-row items-center justify-between bg-[#edeae5] rounded-2xl overflow-hidden h-auto md:h-[450px] xl:h-[545px]">

                {/* Image Section */}
                  <div className="w-full md:w-1/2 lg:w-[45%] relative h-[250px] sm:h-[300px] md:h-full">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent md:hidden"></div>
                  </div>


                {/* Text Section */}
                <div className="w-full md:w-1/2 text-center md:text-left p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                  <span className="jost_font text-[14px] sm:text-[15px] md:text-[16px] font-medium text-gray-700 uppercase tracking-wide">
                    {slide.subtitle}
                  </span>

                    {index === 0 ? (
                      <h1 className="jost_font text-[22px] sm:text-[26px] md:text-[32px] xl:text-[44px] font-bold mt-3 leading-snug text-gray-900">
                        {slide.title}
                      </h1>
                    ) : (
                      <h2 className="jost_font text-[22px] sm:text-[26px] md:text-[32px] xl:text-[44px] font-bold mt-3 leading-snug text-gray-900">
                        {slide.title}
                      </h2>
                    )}


                  <p className="jost_font text-[14px] sm:text-[16px] md:text-[18px] mt-3 text-gray-600 max-w-xl mx-auto md:mx-0">
                    {slide.description}
                  </p>

                  <Link
                    href={slide.link}
                    className="inline-block mt-6 px-5 sm:px-6 py-3 bg-black text-white text-[14px] sm:text-[16px] font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-300 self-center md:self-start"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Hero;
