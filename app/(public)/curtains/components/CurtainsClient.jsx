"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CurtainsClient = ({ curtainsCat }) => {
  if (!curtainsCat || !curtainsCat.subcategories?.length) {
    return (
      <div className="container mx-auto py-20 text-center text-gray-500 text-lg">
        No Curtains Found
      </div>
    );
  }

  const { subcategories } = curtainsCat;

  return (
    <section className="py-16 bg-[#fffaf5] min-h-screen">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <h2 className="text-center text-4xl font-semibold text-gray-900 mb-12">
          Curtains
        </h2>

        {/* Grid Section */}
        <div className="flex flex-wrap gap-10 items-center justify-center">
          {subcategories.map((sub) => (
            <div
              key={sub._id}
              className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-200 hover:shadow-[0_4px_18px_rgba(0,0,0,0.12)] transition-all duration-300 w-full max-w-[320px]"
            >
              <Link href={`/curtains/${sub._id}`}>
                {/* Image */}
                <div className="relative w-full h-[300px]">
                  <Image
                    src={sub.image || "/no-image.jpg"}
                    alt={sub.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Title */}
                <div className="py-3 text-center border-t border-gray-200 bg-[#fff]">
                  <h3 className="text-[17px] text-[#633f28] font-semibold capitalize tracking-wide">
                    {sub.name}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurtainsClient;
