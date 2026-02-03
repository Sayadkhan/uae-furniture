import { formatCurrency } from "@/lib/formatCurrency";
import { connectDB } from "@/lib/mongodb";
import Product from "@/model/Product";
import Image from "next/image";
import Link from "next/link";


async function getTopSellProducts() {
  await connectDB();
  const products = await Product.find({ topsell: true })
    .populate("category", "name")
    .populate("subcategory", "name")
    .lean();
  return JSON.parse(JSON.stringify(products));


}

export const dynamic = 'force-dynamic';

const TopPicks = async () => {
  const products = await getTopSellProducts();

  return (
    <div className="pb-[50px] lg:pb-[100px]">
      <div className="container">
        <h3 className="text-[35px] font-semibold text-black mb-5">Top Picks</h3>
        <div className="flex flex-wrap items-center justify-center gap-5">
          {products.length > 0 ? (
            products.map((item) => (
              <div
                key={item._id}
                className="w-80 lg:w-80 pb-4 shadow overflow-hidden rounded-lg group"
              >
                <Link href={`/product/${item.slug}`}>
                  <div className="w-full h-[250px] overflow-hidden">
                    <Image
                      className="w-full h-full object-cover group-hover:scale-[1.2] transition-all duration-300"
                      src={item.images[0]}
                      alt={item.name}
                      width={400}
                      height={300}
                    />
                  </div>
                  <div className="mt-3 pl-4">
                     <h5 className='text-[16px] font-normal text-[#575757]'>{item.category.name}</h5> 
                    <h3 className="text-[24px] font-medium">{item.name}</h3>
                    <span className="text-[20px] font-medium mt-1 block">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No top-selling products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopPicks;
