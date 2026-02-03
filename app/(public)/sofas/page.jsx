import React, { Suspense } from 'react'
import Sofas from './components/Sofas';

export const dynamic = 'force-dynamic';


const page = () => {
  return (
    <div>
     <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>loading....</div>}>
      <Sofas/>
     </Suspense>
    </div>
  )
}

export default page
