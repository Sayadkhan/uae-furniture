
import { connectDB } from '@/lib/mongodb';
import FeatureProduct from './FeatureProduct'
import Product from '@/model/Product';


async function getFeaturedProducts() {
  await connectDB();
  const products = await Product.find({ featured: true })
    .populate("category", "name")
    .populate("subcategory", "name")
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export const dynamic = 'force-dynamic';


const PopularBrands = async () => {

const featuredProduct = await getFeaturedProducts()

  return (
        <div>
            <FeatureProduct featuredProduct={featuredProduct}/>
        </div>
        )
}

export default PopularBrands