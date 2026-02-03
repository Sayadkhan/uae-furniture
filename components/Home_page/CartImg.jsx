"use client"
import "../Home_page/CartImg.css"
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';


const CartImg = () => {
  return (
    <>
    <div className="">
        <div className="container">
            <Swiper
                rewind={true}
                slidesPerView={6}
                spaceBetween={30}
                navigation={true}
                modules={[Navigation]}
                className="mySwiper h-[400px] bg-amber-500"
            >
                <SwiperSlide>Slide 1</SwiperSlide>
                <SwiperSlide>Slide 2</SwiperSlide>
                <SwiperSlide>Slide 3</SwiperSlide>
                <SwiperSlide>Slide 4</SwiperSlide>
                <SwiperSlide>Slide 5</SwiperSlide>
                <SwiperSlide>Slide 6</SwiperSlide>
                <SwiperSlide>Slide 7</SwiperSlide>
                <SwiperSlide>Slide 8</SwiperSlide>
                <SwiperSlide>Slide 9</SwiperSlide>
            </Swiper>
        </div>
    </div>
    </>
  )
}

export default CartImg