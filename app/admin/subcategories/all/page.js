import React, { Suspense } from "react";
import AllSubCategory from "./AllsubCategory";

const page = () => {
  return (
    <div>
      <Suspense fallback={<>Loading data....</>}>
        <AllSubCategory />
      </Suspense>
    </div>
  );
};

export default page;
