import React, { Suspense } from 'react'
import ShopPage from './components/ShopPage'

const page = () => {
  return (
    <div>
    <Suspense fallback={<div className='min-h-screen container mx-auto flex items-center justify-center'>Loading Data....</div>}>
        <ShopPage/>
    </Suspense>
    </div>
  )
}

export default page
