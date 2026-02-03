import AboutCouter from '@/components/About_page/AboutCouter'
import AboutFeatures from '@/components/About_page/AboutFeatures'
import AboutHero from '@/components/About_page/AboutHero'
import AboutTabs from '@/components/About_page/AboutTabs'
import AboutUs from '@/components/About_page/AboutUs'
import React from 'react'

const page = () => {
  return (
    <div>
        <AboutHero />
        <AboutTabs />
        <AboutCouter />
        <AboutFeatures />
    </div>
  )
}

export default page