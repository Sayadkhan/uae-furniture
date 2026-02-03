import ShopClient from '@/components/Shop_Page/ShopClient';
import { connectDB } from '@/lib/mongodb';
import Product from '@/model/Product';
import Category from '@/model/Category';
import SubCategory from '@/model/SubCategory';
import ChildCategory from '@/model/ChildCategory';
import { Suspense } from 'react';

async function getAllData() {
  await connectDB();


  const productsPromise = Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $lookup: {
        from: "subcategories",
        localField: "subcategory",
        foreignField: "_id",
        as: "subcategory",
      },
    },
    { $unwind: "$subcategory" },
    {
      $lookup: {
        from: "childcategories",
        localField: "childcategory",
        foreignField: "_id",
        as: "childcategory",
      },
    },
    { $unwind: { path: "$childcategory", preserveNullAndEmptyArrays: true } },
  ]);

  // 2️⃣ Fetch category/subcategory/childcategory lists in parallel
  const [products, categories, subCategories, childCategories] = await Promise.all([
    productsPromise,
    Category.find({}).sort({ createdAt: -1 }).lean(),
    SubCategory.find({}).sort({ createdAt: -1 }).lean(),
    ChildCategory.find({}).lean(),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    categories: JSON.parse(JSON.stringify(categories)),
    subCategories: JSON.parse(JSON.stringify(subCategories)),
    childCategories: JSON.parse(JSON.stringify(childCategories)),
  };
}

export const dynamic = 'force-dynamic';

const ShopPage = async () => {
  const { products, categories, subCategories, childCategories } = await getAllData();

  return (
<Suspense fallback={<>Getting the Data.....</>}>
    <ShopClient
      products={products}
      categories={categories}
      subCategories={subCategories}
      childCategories={childCategories}
    />
</Suspense>
  );
};

export default ShopPage;
