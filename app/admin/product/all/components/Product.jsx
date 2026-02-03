import ProductTable from "@/components/Admin/product/ProductTable";
// import { connectDB } from "@/lib/mongodb";
// import Product from "@/model/Product";
// import Category from "@/model/Category";
// import SubCategory from "@/model/SubCategory";


// async function getProducts() {
//   await connectDB();
//   const products = await Product.find({})
//     .populate("category", "name")
//     .populate("subcategory", "name")
//     .lean();
//   return JSON.parse(JSON.stringify(products));
// }

export const dynamic = 'force-dynamic';

const ProductPage = async () => {
  // const products = await getProducts();

  return (
    <div>
      <ProductTable  />
    </div>
  );
};

export default ProductPage;
