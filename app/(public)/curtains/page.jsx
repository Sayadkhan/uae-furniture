import React, { Suspense } from 'react'
import Curtains from './components/Curtains'

export const dynamic = 'force-dynamic';


const page = () => {
  return (
    <div>
     <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>loading....</div>}>
       <Curtains/>
     </Suspense>
    </div>
  )
}

export default page
