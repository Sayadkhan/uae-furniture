
import ChildCategoryPage from '@/components/Admin/ChildCategory/ChildCtegoryTable';
import { connectDB } from '@/lib/mongodb';
import ChildCategory from '@/model/ChildCategory';
import React, { Suspense } from 'react'




 async function getAllChildCategory() {
  await connectDB();

    const childCategories = await ChildCategory.find({})
      .populate("category", "name")      
      .populate("subcategory", "name"); 

  return JSON.parse(JSON.stringify(childCategories));
}

const AllChild = async () => {


const data = await getAllChildCategory()



  return (
    <div>
  <Suspense>
        <ChildCategoryPage data={data}/>
  </Suspense>
    </div>
  )
}

export default AllChild
