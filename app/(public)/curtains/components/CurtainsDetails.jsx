import { connectDB } from '@/lib/mongodb';
import Product from '@/model/Product';
import React from 'react';
import CurtainsProduct from './CurtainsProduct';
import SubCategory from '@/model/SubCategory';

const CurtainsDetails = async ({ id }) => {
  await connectDB();


  const subCategoy = await SubCategory.findById(id).lean();

  const serializedSubCategory = JSON.parse(
  JSON.stringify({
    ...subCategoy,
    _id: subCategoy._id.toString(),
  })
);

  // Fetch products with populated category/subcategory
  const products = await Product.find({ subcategory: id })
    .populate("category", "name")
    .populate("subcategory", "name")
    .lean();


  // console.log("Fetched curtains products:", products);

  // Convert all ObjectIds to strings and make it fully JSON-safe
  const serializedProducts = JSON.parse(
    JSON.stringify(
      products.map((product) => ({
        ...product,
        _id: product._id.toString(),
        category: product.category
          ? { ...product.category, _id: product.category._id.toString() }
          : null,
        subcategory: product.subcategory
          ? { ...product.subcategory, _id: product.subcategory._id.toString() }
          : null,
        childcategory: product.childcategory
          ? { ...product.childcategory, _id: product.childcategory._id.toString() }
          : null,
        variants: product.variants?.map((v) => ({
          ...v,
          _id: v._id?.toString(),
        })),
      }))
    )
  );

  return (
    <div>
      <CurtainsProduct products={serializedProducts} subCategoy={serializedSubCategory} />
    </div>
  );
};

export default CurtainsDetails;
