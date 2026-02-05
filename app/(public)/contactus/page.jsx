import ContactHero from '@/components/Contact_page/ContactHero'
import ContactUs from '@/components/Contact_page/ContactUs'
import React from 'react'

export const dynamic = 'force-dynamic';

const page = () => {
  return (
    <div>
      <ContactHero />
      <ContactUs />
    </div>
  )
}

export default page