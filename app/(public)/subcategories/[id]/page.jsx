
import { connectDB } from '@/lib/mongodb';
import Product from '@/model/Product';
import React, { Suspense } from 'react'
import ProductList from './ProductList';

async function getProduct(id) { 
  await connectDB(); 
  const product = await Product.find({ subcategory: id }) 
  .populate("category", "name")
  .populate("subcategory", "name")
  .lean(); 
   
  if (!product) return null; 
  
  return JSON.parse(JSON.stringify(product)); 
}

const page = ({params}) => {
  
  const {id} =  params;


   return (
     <div className="container mx-auto min-h-screen p-6">
      <Suspense fallback={<LoadingSkeleton />}>
         <ProductList id={id} />
      </Suspense>
    </div>
  );
}

export default page


function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 rounded-xl h-40"
        />
      ))}
    </div>
  );
}






