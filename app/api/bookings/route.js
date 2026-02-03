import { connectDB } from "@/lib/mongodb";
import Booking from "@/model/Booking";

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const booking = await Booking.create(data);

    console.log(booking);

    return new Response(JSON.stringify(booking), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    console.error(error);
    return new Response(JSON.stringify({ message: "Failed to save booking" }), {
      status: 500,
    });
  }
}
