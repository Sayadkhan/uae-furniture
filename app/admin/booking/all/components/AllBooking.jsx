import React from 'react'
import BookingTable from './BookingTable'
import { connectDB } from '@/lib/mongodb';
import Booking from '@/model/Booking';


async function getAllBooking() {
  await connectDB();
  const booking = await Booking.find({})
    .sort({ createdAt: -1 })
    .lean(); 

  return JSON.parse(JSON.stringify(booking));
}


export const dynamic = 'force-dynamic';




const AllBooking = async () => {

  const booking = await getAllBooking()


  return (
    <div>
      <BookingTable booking={booking}/>
    </div>
  )
}

export default AllBooking
