import Link from 'next/link';
import React from 'react';
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";
import SubFooter from './SubFooter';

const Footer = () => {
  return (
    <>     
      <footer className="py-14 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-10 border-b border-[#444]">
            
            {/* Logo & Contact */}
            <div className="text-white lg:col-span-2">
              <Link href="/" className="jost_font text-[25px]">Furniture</Link>
              <div className="flex gap-2 jost_font mt-5">
                <IoLocationOutline className="text-[25px]" />
                <span className="jost_font w-full lg:w-[300px]">
                  99 New Theme St. XY, USA 12345, Beside the Sun point land.
                </span>
              </div>
              <div className="flex gap-2 jost_font mt-5">               
                <AiOutlineMail className="text-[20px]" />
                <span className="jost_font">demo@example.com</span>
              </div> 
              <Link
                href="/"
                className="jost_font text-[18px] font-semibold text-white mt-4 block"
              >
                +00 123-456-789
              </Link>             
            </div>

            {/* Get to Know Us */}
            <div>
              <h3 className="text-white text-[20px] mb-4">Get to know Us</h3>
              <ul className="text-white space-y-3">
                <li><Link href="/">About Us</Link></li>
                <li><Link href="/">Term & Policy</Link></li>
                <li><Link href="/">Careers</Link></li>
                <li><Link href="/">News & Blog</Link></li>
                <li><Link href="/">Contact Us</Link></li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="text-white text-[20px] mb-4">Information</h3>
              <ul className="text-white space-y-3">
                <li><Link href="/">Help Center</Link></li>
                <li><Link href="/">Feedback</Link></li>
                <li><Link href="/">FAQs</Link></li>
                <li><Link href="/">Size Guide</Link></li>
                <li><Link href="/">Payments</Link></li>
              </ul>
            </div>

            {/* Orders & Returns */}
            <div>
              <h3 className="text-white text-[20px] mb-4">Orders & Returns</h3>
              <ul className="text-white space-y-3">
                <li><Link href="/">Track Order</Link></li>
                <li><Link href="/">Delivery</Link></li>
                <li><Link href="/">Services</Link></li>
                <li><Link href="/">Returns</Link></li>
                <li><Link href="/">Exchange</Link></li>
              </ul>
            </div>

            {/* Download Apps */}
            <div>
              <h3 className="text-white text-[20px] mb-4">Get Download Apps</h3>
              <p className="text-[15px] text-white">
                Enjoy 15% discount on your first furniture purchase, bringing
                comfort, elegance, and style home
              </p>
            </div>
          </div>

          {/* Sub Footer */}
          <SubFooter />
        </div>
      </footer>
    </>
  );
};

export default Footer;