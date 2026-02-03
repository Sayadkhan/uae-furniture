"use client"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/formatCurrency';

const SliderProduct = ({products}) => {

  

  return ( 
        <Swiper
          modules={[Pagination]}
          slidesPerView={4}
          spaceBetween={25}
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className="mySwiper"
        >
          {products.map((item, index) => (
            <SwiperSlide key={index}>
            <div className="relative w-full h-[300px] rounded-xl overflow-hidden group shadow-md">
            <Link href={`/product/${item.slug}`} className="block w-full h-full">
              {/* Product Image */}
              <Image
                src={item.images[0] || "https://via.placeholder.com/400x400.png?text=No+Image"}
                alt={item.name}
                width={400}
                height={400}
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

              {/* Info (Bottom Slide Up) */}
              <div className="absolute bottom-0 left-0 w-full px-4 py-3 text-white translate-y-full group-hover:translate-y-0 transition-all duration-500">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <span className="text-sm font-medium">{formatCurrency(item.price)}</span>
              </div>
            </Link>
          </div>

            </SwiperSlide>
          ))}
        </Swiper>

  )
}

export default SliderProduct
