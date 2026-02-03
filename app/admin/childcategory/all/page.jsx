
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import React, { Suspense } from 'react'
import AllChild from './AllChild'


const page = () => {
  return (
    <div>
      <Suspense fallback={<>loading...</>}>
        <AllChild/>
      </Suspense>
    </div>
  )
}

export default page
