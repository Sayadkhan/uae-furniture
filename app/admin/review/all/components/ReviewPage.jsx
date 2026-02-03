import { connectDB } from '@/lib/mongodb';
import Review from '@/model/Review';
import React from 'react'
import ReviewTable from './ReviewTable';


async function getAllReview() {
  await connectDB();
  const allReview = await Review.find({})
  .populate("product")      
  .sort({ createdAt: -1 }).lean();

  return JSON.parse(JSON.stringify(allReview));
}


const ReviewPage = async () => {

  const review = await getAllReview()

  return (
    <div>
      <ReviewTable review={review}/>
    </div>
  )
}

export default ReviewPage
