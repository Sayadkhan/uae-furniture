import React, { Suspense } from 'react'
import LogoPage from './components/LogoUpload'

const page = () => {
  return (
    <div>
     <Suspense fallback={<>Loading...</>}>
       <LogoPage/>
     </Suspense>
    </div>
  )
}

export default page
