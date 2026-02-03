import { connectDB } from '@/lib/mongodb';
import Category from '@/model/Category';
import ChildCategory from '@/model/ChildCategory';
import SubCategory from '@/model/SubCategory';
import React from 'react'
import CurtainsClient from './CurtainsClient';


async function getACategoryWithSub() {
  await connectDB();

  // একটা category খুঁজে বের করো
  const cat = await Category.findOne({
    name: { $regex: /^curtains$/i },
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


const Curtains = async () => {

  const curtainsCat = await getACategoryWithSub()
  return (
    <div>
      <CurtainsClient curtainsCat={curtainsCat}/>
    </div>
  )
}

export default Curtains
