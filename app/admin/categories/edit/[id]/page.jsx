import CategoryEditFrom from '@/components/Admin/Category/CategoryEditFrom'
import { connectDB } from '@/lib/mongodb';
import Category from '@/model/Category';
import mongoose from 'mongoose';
import { Suspense } from 'react';


async function getCategory(id) {
  await connectDB();

  const category = await Category.findOne({
    _id: new mongoose.Types.ObjectId(id),
  })

  if (!category) return null;

  return JSON.parse(JSON.stringify(category));
}


export const dynamic = 'force-dynamic';



const page = async ({params}) => {


  const { id } = await params;

  const category = await getCategory(id);

  return (
    <div>
     <Suspense fallback={<>Loading Category Details...</>}>
       <CategoryEditFrom category={category}/>
     </Suspense>
    </div>
  )
}

export default page
