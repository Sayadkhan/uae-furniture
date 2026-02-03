import Product from "@/model/Product";
import Category from "@/model/Category";
import SubCategory from "@/model/SubCategory";
import { connectDB } from "@/lib/mongodb";
import EditProductPage from "@/components/Admin/product/eidt/ProductEditPage";
import mongoose from "mongoose";
import ChildCategory from "@/model/ChildCategory";

async function getProduct(id) {
  await connectDB();

  const product = await Product.findOne({
    _id: new mongoose.Types.ObjectId(id),
  })
    .populate("category", "name")
    .populate("subcategory", "name")
    .populate("childcategory", "name")
    .lean();

  console.log(product);

  if (!product) return null;

  return JSON.parse(JSON.stringify(product));


}

async function getAllCategoryWithSub() {
  await connectDB();

  const categories = await Category.find({}).sort({ createdAt: -1 }).lean();

  // fetch subcategories + childcategories for each category
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




export const dynamic = "force-dynamic";

const Editpage = async ({ id }) => {


  const product = await getProduct(id);

  const categories = await getAllCategoryWithSub();

  return (
    <div>
      <EditProductPage product={product} categories={categories} />
    </div>
  );
};

export default Editpage;
