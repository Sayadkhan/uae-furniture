import React, { Suspense } from 'react'
import SofasDetails from '../components/SofasDetails';


export const dynamic = 'force-dynamic';

const page = async ({params}) => {
  const {id} = await params
  return (
    <div className='min-h-screen'>
     <Suspense  fallback={<div className='flex items-center justify-center'>loading....</div>}>
       <SofasDetails id={id}/>
     </Suspense>
    </div>
  )
}

export default page
