import { connectDB } from "@/lib/mongodb";
import Banner from "@/model/Banner";
import Hero from "./Hero";



async function getAllBanner() {
  await connectDB();
  const banners = await Banner.find({})
    .sort({ createdAt: -1 })
    .lean(); 

  return JSON.parse(JSON.stringify(banners));
}

export const dynamic = 'force-dynamic';
const HeroServer = async () => {


  const banner = await getAllBanner()
  return (
    <div>
      <Hero banner={banner}/>
    </div>
  )
}

export default HeroServer




// import AllCategoryTable from "@/components/Admin/Category/AllCategoryTable";
// import { connectDB } from "@/lib/mongodb";
// import Category from "@/model/Category";
// import { Suspense } from "react";


// async function getAllCategory() {
//   await connectDB();
//   const categories = await Category.find({})
//     .sort({ createdAt: -1 })
//     .lean(); 

//   return JSON.parse(JSON.stringify(categories));
// }


// export const dynamic = 'force-dynamic';