import React, { Suspense } from 'react'
import ChildCatAdd from './components/ChildCatAdd'
export const dynamic = 'force-dynamic';

const page = () => {
  return (
    <div>
      <Suspense fallback={<div className='flex items-center justify-center'>Loading the Category information.....</div>}>
      <ChildCatAdd/>
      </Suspense>
    </div>
  )
}

export default page
