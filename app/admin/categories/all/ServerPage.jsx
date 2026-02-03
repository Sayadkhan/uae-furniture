


import AllCategoryTable from "@/components/Admin/Category/AllCategoryTable";
import { connectDB } from "@/lib/mongodb";
import Category from "@/model/Category";
import { Suspense } from "react";


async function getAllCategory() {
  await connectDB();
  const categories = await Category.find({})
    .sort({ createdAt: -1 })
    .lean(); 

  return JSON.parse(JSON.stringify(categories));
}


export const dynamic = 'force-dynamic';

const ServerPage = async () => {

    const category = await getAllCategory();

  return (
    <div>
      <Suspense fallback={<>loading Category....</>}>
            <AllCategoryTable category={category}/>
      </Suspense>
  
    </div>
  )
}

export default ServerPage
