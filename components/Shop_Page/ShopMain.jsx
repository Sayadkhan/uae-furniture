"use client"
import React from 'react'

const categories = [
  { name: "Our Store", count: 24 },
  { name: "Beds", count: 8 },
  { name: "Couch", count: 8 },
  { name: "Living Room", count: 19 },
  { name: "Sofa", count: 5 },
  { name: "Tables", count: 14 },
  { name: "Wardrobe", count: 6 },
];

const brands = [
  "Creative", "Design", "Gallery", "Golden", 
  "Highlight", "Modern", "Nature", "Sparker"
];

const ShopMain = () => {
  return (
    <div className='py-[100px]'>
        <div className="container">
            <div className="flex gap-[30px]">
                {/* -----------sidebar----------- */}
                <div className="w-[20%]">
                    {/* ------------Categories Section-------- */}
                    <div className="mb-6 border">
                        <div className="border-b">
                            <h2 className="text-lg font-semibold py-2 flex justify-between items-center px-2">
                            Shop By Categories <span className="text-xl">−</span>
                            </h2>
                        </div>
                        <ul className="space-y-2 px-3 py-4">
                        {categories.map((item, index) => (
                            <li key={index} className="flex items-center">
                            <input type="checkbox" className="mr-2" id={`category-${index}`} />
                            <label htmlFor={`category-${index}`} className="text-sm text-gray-700">
                                {item.name} <span className="text-gray-500">({item.count})</span>
                            </label>
                            </li>
                        ))}
                        </ul>
                    </div>
                    {/* Brands Section */}
                    <div className='border'>
                        <div className="">
                            <h2 className="text-lg font-semibold border-b py-2 flex justify-between items-center px-2">Brands <span className="text-xl">−</span></h2>
                        </div>
                        <ul className="space-y-2 px-3 py-4">
                        {brands.map((brand, index) => (
                            <li key={index} className="flex items-center">
                            <input type="checkbox" className="mr-2" id={`brand-${index}`} />
                            <label htmlFor={`brand-${index}`} className="text-sm text-gray-700">
                                {brand} <span className="text-gray-500">(3)</span>
                            </label>
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
                {/* ------------main-body---------- */}
                <div className="w-[80%] h-[400px] bg-black"></div>
            </div>
        </div>
    </div>
  )
}

export default ShopMain