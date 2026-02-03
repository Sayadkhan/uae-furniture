import React, { Suspense } from 'react'
import CurtainsDetails from '../components/CurtainsDetails'

const page = async ({params}) => {
  const {id} = await params
  return (
    <div className='min-h-screen'>
     <Suspense  fallback={<div className='flex items-center justify-center'>loading....</div>}>
       <CurtainsDetails id={id}/>
     </Suspense>
    </div>
  )
}

export default page
