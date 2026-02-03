

import { connectDB } from '@/lib/mongodb';
import Category from '@/model/Category';
import ChildCategory from '@/model/ChildCategory';
import SubCategory from '@/model/SubCategory';
import Link from 'next/link'
import NavbarClinet from './NavbarClinet';
import { Suspense } from 'react';


async function getAllCategoryWithSub() {
  await connectDB();

  const categories = await Category.find({top_category:true}).sort({ createdAt: -1 }).lean();
  const categoriesWithSubAndChild = await Promise.all(
    categories.map(async (cat) => {
      const subcategories = await SubCategory.find({
        category: cat._id,
      }).lean();

      // attach child categories to each subcategory
      const subcategoriesWithChild = await Promise.all(
        subcategories.map(async (sub) => {
          const childcategories = await ChildCategory.find({
            subcategory: sub._id,
          }).lean();
          return { ...sub, childcategories };
        })
      );

      return { ...cat, subcategories: subcategoriesWithChild };
    })
  );

  return JSON.parse(JSON.stringify(categoriesWithSubAndChild));
}


async function getACategoryWithSub() {
  await connectDB();

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


const Navbar = async () => {
  const categories = await getAllCategoryWithSub();
  const curtains = await getACategoryWithSub()
  const sofas = await getSofasCategoryWithSub();

  // console.log('sofas Category:', sofas);




  return (
<Suspense>
      <NavbarClinet categories={categories} curtains={curtains} sofas={sofas}/>
</Suspense>
  );
};

export default Navbar;
