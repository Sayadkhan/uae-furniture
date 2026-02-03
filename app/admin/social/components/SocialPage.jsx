
import SocialMediaPage from '@/components/social/AllSocial'
import { connectDB } from '@/lib/mongodb';
import SocialMedia from '@/model/SocialMedia';
import React from 'react'



async function getSocial() {
  await connectDB();
  const social = await SocialMedia.find({})
    .lean();
  return JSON.parse(JSON.stringify(social));
}

export const dynamic = 'force-dynamic';
const SocialPage = async () => {


const social = await getSocial()


  return (
    <div>
      <SocialMediaPage social={social} />
    </div>
  )
}

export default SocialPage
