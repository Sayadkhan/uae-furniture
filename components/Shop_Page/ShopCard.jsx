"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'

const ShopCard = ({ product }) => {

    const { data, isLoading, isError } = useQuery({
      queryKey: ["whatsapp-number"],
      queryFn: async () => {
        const res = await fetch("/api/whatsapp");
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      },
      staleTime: 5 * 60 * 1000,
    });
  
    
    const shortTitle = product.name?.length > 45
    ? product.name.substring(0, 45) + "..."
    : product.name;
    
    if (isLoading || isError || !data?.number) return null; 
      const number = data?.number; 

  return (
    <Card
      key={product._id}
      className="shadow-md rounded-lg flex flex-col overflow-hidden"
    >

      {/* IMAGE */}
      <div className="h-[220px] w-full overflow-hidden">
        <Image
          className="w-full h-full object-cover"
          src={product?.images?.[0] || "/no-image.png"}
          width={500}
          height={500}
          alt={product?.name || "Product Image"}
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col justify-between flex-grow p-4">

        <div>
          {/* 🔥 Truncated Title */}
          <CardTitle className="text-[20px] leading-tight min-h-[52px]">
            {shortTitle}
          </CardTitle>

          <p className="text-lg font-semibold mt-2">${product.price}</p>
        </div>

        {/* BUTTONS */}
        <div className="mt-4 flex flex-col space-y-2">
            <div className="text-[15px] font-medium py-3  text-white block mt-3 rounded-lg">
                  <a
                  href={`https://wa.me/${number}?text=Hi, I am interested in ${product?.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition text-sm sm:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.52 3.48A11.89 11.89 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.07 1.52 5.78L0 24l6.42-1.68A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.25-6.2-3.48-8.52zM12 22a10 10 0 0 1-5.22-1.44l-.37-.22-3.81.99.99-3.81-.22-.37A10 10 0 1 1 22 12a10 10 0 0 1-10 10zm5.16-7.05c-.28-.14-1.65-.81-1.9-.9s-.43-.14-.61.14-.7.9-.86 1.09-.32.21-.59.07c-.28-.14-1.18-.44-2.25-1.38-.83-.74-1.39-1.65-1.55-1.93s-.02-.43.12-.57c.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.1-.18.05-.33-.02-.46-.07-.14-.61-1.48-.84-2.03-.22-.53-.45-.46-.61-.46-.16 0-.35-.02-.54-.02s-.46.07-.7.33c-.24.26-.91.88-.91 2.14s.93 2.48 1.06 2.65c.14.16 1.84 2.83 4.46 3.97 2.62 1.14 2.62.76 3.09.71.46-.05 1.5-.61 1.71-1.2.21-.59.21-1.1.14-1.21-.07-.12-.25-.18-.53-.32z" />
                  </svg>
                      Order On WhatsApp
                </a>
            </div>
          <Link href={`/product/${product.slug}`}>
            <Button className="w-full hover:cursor-pointer">View Details</Button>
          </Link>
        </div>

      </div>

    </Card>
  )
}

export default ShopCard;
