import { connectDB } from '@/lib/mongodb';
import Category from '@/model/Category';
import ChildCategory from '@/model/ChildCategory';
import SubCategory from '@/model/SubCategory';
import SofasClient from './SofasClient';


async function getSofasCategoryWithSub() {
    await connectDB();
    const cat = await Category.findOne({
      name: { $regex: /^sofas$/i },
    })
      .sort({ createdAt: -1 })
      .lean();

        if (!cat) return null; 

  const subcategories = await SubCategory.find({
    category: cat._id,
  }).lean();

  const subcategoriesWithChild = await Promise.all(
    subcategories.map(async (sub) => {
      const childcategories = await ChildCategory.find({
        subcategory: sub._id,
      }).lean();
      return { ...sub, childcategories };
    })
  );
  const categoryWithSubAndChild = {
    ...cat,
    subcategories: subcategoriesWithChild,
  };

   return JSON.parse(JSON.stringify(categoryWithSubAndChild));
  
}

export const dynamic = 'force-dynamic';

const Sofas = async () => {

  const sofasCat = await getSofasCategoryWithSub()

  return (
    <div>
      <SofasClient sofasCat={sofasCat}/>
    </div>
  )
}

export default Sofas
