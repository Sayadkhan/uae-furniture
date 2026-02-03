'use client'
import Link from 'next/link'
import React from 'react'
import { IoCallOutline } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";

const TopNavbar = () => {
  return (
    <div className="bg-black text-white py-3 px-4 jost_font border-b border-[#333]">
        <div className="container">
            <div className="block md:flex justify-between items-center">   
                <div className="md:flex hidden items-center justify-center gap-6">
                    <div className="flex items-center gap-1">
                    <span className='text-white'><IoCallOutline /></span>
                        <Link className='cursor-pointer jost_font' href="" >(+91) 123-456-789</Link>                        
                    </div>
                    <div className="flex items-center gap-1">
                    <span><SlLocationPin /></span>
                        <Link className='cursor-pointer jost_font' href="">Find Store</Link>
                        <span className="hover:underline "></span>
                    </div>
                </div>
        
                <div className="text-white jost font-medium jost_font text-center lg:mt-0 mt-1">
                    Summer Sale 15% off!{' '}
                    <Link href="/shop" className="underline hover:text-red-500 jost_font">
                    Shop Now!
                    </Link>
                </div>
        
                <div className="lg:flex hidden items-center gap-6 jost_font text-[14px]">
                    <Link href="/" className="hover:underline ">
                    Home
                    </Link>
                    <Link href="/shop" className="hover:underline">
                    Shop
                    </Link>
                    <Link href="/aboutus" className="hover:underline">
                    About
                    </Link>
                    <Link href="/contactus" className="hover:underline">
                    Contact
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TopNavbar