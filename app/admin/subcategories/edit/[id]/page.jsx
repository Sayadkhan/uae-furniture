import EditSubCategoryPage from "@/components/Admin/Subcategory/SubcategoryForm";
import { connectDB } from "@/lib/mongodb";
import SubCategory from "@/model/SubCategory";
import mongoose from "mongoose";


async function getSubCategory(id) {
  await connectDB();

  const subCategory = await SubCategory.findOne({
    _id: new mongoose.Types.ObjectId(id),
  })
  



  if (!subCategory) return null;

  return JSON.parse(JSON.stringify(subCategory));
}



export const dynamic = 'force-dynamic';



const page = async ({params}) => {
    const { id } = await params;

  const subCategory = await getSubCategory(id);
  return (
    <div>
      <EditSubCategoryPage subCategory={subCategory}/>
    </div>
  )
}

export default page
