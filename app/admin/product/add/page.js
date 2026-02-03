export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { Suspense } from "react";
import AddProductPage from "./components/ProductAdd";

const page = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">Loading...</div>
        }
      >
        <AddProductPage />
      </Suspense>
    </div>
  );
};

export default page;
