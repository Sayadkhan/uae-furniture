import React from 'react';
import ShopCard from '../Shop_Page/ShopCard';

const ProductPage = ({ product }) => {
  if (!product || product.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">No products found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {product.map((item) => (
          <div
            key={item._id}
            className="transition-transform transform hover:-translate-y-1 hover:shadow-xl duration-300"
          >
            <ShopCard product={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
