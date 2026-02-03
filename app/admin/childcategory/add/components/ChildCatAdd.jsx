import AddChildCategoryPage from "@/components/Admin/ChildCategory/AddChildCategoryPage";
import { connectDB } from "@/lib/mongodb";
import Category from "@/model/Category";
import SubCategory from "@/model/SubCategory";




 async function getAllCategoryWithSub() {
  await connectDB();

  const categories = await Category.find({}).sort({ createdAt: -1 }).lean();

  const categoriesWithSub = await Promise.all(
    categories.map(async (cat) => {
      const subcategories = await SubCategory.find({ category: cat._id }).lean();
      return { ...cat, subcategories };
    })
  );

  return JSON.parse(JSON.stringify(categoriesWithSub));
}

export const dynamic = 'force-dynamic';

const ChildCatAdd = async () => {
  const categorySubcategory = await getAllCategoryWithSub()


  return (
    <div>
      <AddChildCategoryPage categorySubcategory={categorySubcategory}/>
    </div>
  )
}

export default ChildCatAdd
