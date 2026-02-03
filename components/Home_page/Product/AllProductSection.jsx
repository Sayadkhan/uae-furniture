import { connectDB } from '@/lib/mongodb';
import Product from '@/model/Product';
import ProductSection from './ProductSection';



async function getProducts() {
  await connectDB();
  const products = await Product.find({})
    .populate("category", "name")
    .populate("subcategory", "name")
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export const dynamic = 'force-dynamic';

const AllProductSection = async () => {

  const product = await getProducts()
  return (
    <div>
      <ProductSection product={product}/>
    </div>
  )
}

export default AllProductSection
