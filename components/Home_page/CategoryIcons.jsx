import Image from 'next/image'
import Link from 'next/link'
import React from 'react'




const CategoryIcons = ({categories}) => {
  return (
    <div className='pb-[20px]'>
        <div className="container">
            <div className="w-full xl:w-[80%] m-auto">
                <div className="flex flex-wrap items-center justify-center gap-20">
                    {categories.map((item,index)=>(
                        <div key={index} className="flex justify-center items-center">
                            <Link href={`/categories/${item._id}`}>
                                <Image src={item.icon} width={100} height={100} alt={item.name} />
                                <h5 className='text-[17px] font-medium text-center mt-4'>{item.name}</h5>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default CategoryIcons