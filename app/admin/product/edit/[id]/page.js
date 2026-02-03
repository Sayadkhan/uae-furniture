import React, { Suspense } from "react";
import Editpage from "../components/EditPage";

const page = async ({ params }) => {
  const { id } = await params;
  return (
    <div>
      <Suspense fallback={<>Loading Product....</>}>
        <Editpage id={id} />
      </Suspense>
    </div>
  );
};

export default page;
