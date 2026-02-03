import React, { Suspense } from 'react'
import SocialPage from '../components/SocialPage'

const page = () => {
  return (
    <div>
      <Suspense fallback={<>Loading Data....</>}>
        <SocialPage/>
      </Suspense>
    </div>
  )
}

export default page
