import Product from '@/model/Product';
import SliderProduct from '../LatestProducts/SliderProduct';
import { connectDB } from '@/lib/mongodb';
import Category from '@/model/Category';
import SubCategory from '@/model/SubCategory';

async function getLatestProducts() {
  await connectDB();
  const products = await Product.find({newarrivable: true}) // fixed typo
    .populate("category", "name")
    .populate("subcategory", "name")
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export const dynamic = 'force-dynamic';

const LatestProducts = async () => {
  const products = await getLatestProducts(); 


  return (
    <div className='pb-[80px]'>
      <div className="container">
        <h3 className='text-[35px] font-semibold text-black mb-5'>Latest Products</h3>

        {/* Pass products to SliderProduct */}
        <SliderProduct products={products} />
      </div>
    </div>
  )
}

export default LatestProducts;
