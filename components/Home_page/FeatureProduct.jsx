"use client"
import { formatCurrency } from '@/lib/formatCurrency'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

  const FeatureProduct = ({ featuredProduct }) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const { data, isLoading, isError } = useQuery({
      queryKey: ["whatsapp-number"],
      queryFn: async () => {
        const res = await fetch("/api/whatsapp");
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      },
      staleTime: 5 * 60 * 1000,
    });

    if (!mounted || isLoading || isError || !data?.number) return null;
    
      const number = data.number; 
  return (
    <div className='pb-[100px]'>
      <div className="container">
        <div className="">
          <h3 className='text-[35px] font-semibold text-black mb-5'>Featured Product</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[20px]">
          {featuredProduct.map((Item, index) => {
            let finalPrice = Item.price;

            if (Item.discountType === "percentage") {
              finalPrice = Item.price - (Item.price * Item.discount) / 100;
            } else if (Item.discountType === "fixed") {
              finalPrice = Item.price - Item.discount;
            }

            return (
              <div key={index} className="p-[10px] shadow rounded-xl group bg-white">
                <div className="w-full h-[200px] overflow-hidden rounded-lg">
                  <Image
                    className='w-full h-full object-cover group-hover:scale-[1.2] transition-all duration-300'
                    src={Item.images[0]}
                    width={500}
                    height={500}
                    alt={Item.name}
                  />
                </div>
                <div className="text-center mt-5">
                  <span className='text-[15px] font-normal'>{Item.name}</span>

                  {/* Price display */}
                  {finalPrice !== Item.price ? (
                    <div className="mt-2 flex items-center justify-center gap-5">
                      <h4 className='text-[18px] font-semibold text-red-600'>
                        {/* ${finalPrice.toFixed(2)} */}
                        {formatCurrency(finalPrice)}
                      </h4>
                      <p className='text-[14px] text-gray-500 line-through'>
                        {formatCurrency(Item.price)}
                      </p>
                    </div>
                  ) : (
                    <h4 className='text-[22px] font-semibold mt-2'>{formatCurrency(Item.price)}</h4>
                  )}
                <div className='text-center'>
  
                  {/* Discount label */}
                  {Item.discountType === "percentage" && (
                    <p className='text-[14px] text-green-600 mt-1'>
                      Save {Item.discount}%
                    </p>
                  )}

                  {Item.discountType === "flat" && (
                    <p className='text-[14px] text-green-600 mt-1'>
                      Save ${Item.discount}
                    </p>
                  )}

                </div>

            <div className="">
              <a
              href={`https://wa.me/${number}?text=Hi, I am interested in ${Item?.name}`}
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
                  <Link
                    className='text-[15px] font-medium px-6 py-3 bg-black text-white block mt-3 rounded-lg'
                    href={`/product/${Item.slug}`}
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FeatureProduct
