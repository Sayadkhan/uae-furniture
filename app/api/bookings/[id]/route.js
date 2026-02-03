import { connectDB } from "@/lib/mongodb";
import Booking from "@/model/Booking";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { done } = await request.json();

    if (typeof done !== "boolean") {
      return NextResponse.json(
        { error: "Invalid data type for 'done'" },
        { status: 400 }
      );
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { done },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Booking updated successfully", booking: updatedBooking },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const banner = await Booking.findById(id);
    if (!banner)
      return new Response(JSON.stringify({ message: "Banner not found" }), {
        status: 404,
      });

    await Booking.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ message: "Banner deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete banner" }),
      { status: 500 }
    );
  }
}
