import React, { Suspense } from 'react'
import BannerPage from './components/BannerAddPage'


export const dynamic = 'force-dynamic';

const page = () => {

  return (
    <div>
     <Suspense fallback={<>Loading Banner Data...</>}>
       <BannerPage/>
     </Suspense>
    </div>
  )
}

export default page
