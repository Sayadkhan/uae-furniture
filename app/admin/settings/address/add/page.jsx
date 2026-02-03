import React, { Suspense } from 'react'
import AddressPage from '../components/AddressPage'

const page = () => {
  return (
    <div>
     <Suspense fallback={<>Loading Data....</>}>
       <AddressPage/>
     </Suspense>
    </div>
  )
}

export default page
