"use client"
import Image from 'next/image'
import Badroom from "../../public/badroom.jpg"
import Link from 'next/link'


const BedRoomsection = () => {
  return (
    <div className="pb-[80px] md:pb-[100px]">
      <div className="container mx-auto px-4">
        <div className="w-full h-[350px] sm:h-[450px] md:h-[550px] relative rounded-xl overflow-hidden">   
          <Image className="w-full h-full object-cover" src={Badroom} alt="Bedroom Section" />
      
          <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex flex-col justify-center items-center px-4 sm:px-10 md:px-[100px]">
            <div className="text-center max-w-[95%] sm:max-w-[600px] md:max-w-[700px]">
              <span className="text-[14px] sm:text-[16px] md:text-[18px] font-normal text-white">
                UP TO 50% OFF
              </span>
              <h2 className="text-[24px] sm:text-[32px] md:text-[40px] font-bold text-white leading-[34px] sm:leading-[46px] md:leading-[60px] my-4">
                As Cozy As Your Bedroom – Dining Tables at Discount
              </h2>
              <p className="text-[14px] sm:text-[16px] md:text-[18px] font-medium text-white max-w-[90%] sm:max-w-[500px] md:max-w-[550px] mx-auto">
                Get the perfect cabinet for your bedroom room with huge savings. Limited-time offer. Grab yours today!
              </p>
              <Link
                className="text-[14px] sm:text-[16px] md:text-[20px] text-white px-5 sm:px-6 md:px-7 py-2 sm:py-3 bg-[#000] rounded-md inline-block mt-6 md:mt-8"
                href="/shop"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BedRoomsection