import BedRoomsection from "@/components/Home_page/BedRoomsection";
import BookedSection from "@/components/Home_page/BookedSection/BookedSetion";
import CategoryIcons from "@/components/Home_page/CategoryIcons";
import CategoryProduct from "@/components/Home_page/CategoryProduct";
import FeaturedCategory from "@/components/Home_page/Featured";
import HeroServer from "@/components/Home_page/HeroServer";
import LatestProducts from "@/components/Home_page/LatestProduct";
import NewCategory from "@/components/Home_page/NewCat";
import PersentFerniture from "@/components/Home_page/PersentFerniture";
import PopularBrands from "@/components/Home_page/PopularBrands";
import AllProductSection from "@/components/Home_page/Product/AllProductSection";
import TopPicks from "@/components/Home_page/TopPicks";
import PageSkeleton from "@/components/Skeleton/PageSkeleton";
import { Suspense } from "react";


export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Suspense fallback={<PageSkeleton title="Loading homepage..." />}>
        <HeroServer />
        <NewCategory/>

        <Suspense fallback={<PageSkeleton title="Loading featured category..." />}>
          <FeaturedCategory />
        </Suspense>

        <BookedSection/>

        <Suspense fallback={<PageSkeleton title="Loading top picks..." />}>
          <TopPicks />
        </Suspense>

        <PersentFerniture />

        <Suspense fallback={<PageSkeleton title="Loading latest products..." />}>
          <LatestProducts />
        </Suspense>

        <BedRoomsection />
        <Suspense fallback={<PageSkeleton title="Loading popular brands..." />}>
          <PopularBrands />
        </Suspense>

        <Suspense fallback={<PageSkeleton title="Loading category products..." />}>
          <CategoryProduct />
        </Suspense>


        <Suspense fallback={<PageSkeleton title="Loading popular brands..." />}>
          <AllProductSection/>
        </Suspense>
      </Suspense>
    </>
  );
}
