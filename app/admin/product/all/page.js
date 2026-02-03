import React, { Suspense } from "react";
import ProductPage from "./components/Product";

export const dynamic = "force-dynamic";

const page = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            All Product Is Loading
          </div>
        }
      >
        <ProductPage />
      </Suspense>
    </div>
  );
};

export default page;
