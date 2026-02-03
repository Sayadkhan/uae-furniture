import { connectDB } from '@/lib/mongodb';
import Category from '@/model/Category';
import Product from '@/model/Product';
import React from 'react'
import CategorProduct from './CategoryProduct/CategorProduct';




async function getCategoryWiseProducts() {
  await connectDB();

  const categories = await Category.find({}).sort({ createdAt: -1 }).lean();
  const products = await Product.find({})
    .populate("category", "name")
    .populate("subcategory", "name")
    .lean();

  // Group products by category
  const categoryWiseProducts = categories.map((category) => {
    const categoryProducts = products.filter(
      (product) => product.category && product.category._id.toString() === category._id.toString()
    );
    return { ...category, products: categoryProducts };
  });

  return JSON.parse(JSON.stringify(categoryWiseProducts));
}


export const dynamic = 'force-dynamic';




const CategoryProduct = async () => {
  const categoryWiseProducts = await getCategoryWiseProducts();

 

  return (
    <div className="category-products container mx-auto">
        <h3 className="text-[35px] font-semibold text-black mb-5">Category Product</h3>
        <CategorProduct categoryWiseProducts={categoryWiseProducts}/>
    </div>
  );
};

export default CategoryProduct;
