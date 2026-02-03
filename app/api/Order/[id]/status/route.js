import { connectDB } from "@/lib/mongodb";
import Order from "@/model/Order";

// PATCH /api/Order/[id] - update paymentStatus or deliveryStatus
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { paymentStatus, deliveryStatus } = await req.json();

    if (!paymentStatus && !deliveryStatus) {
      return new Response(JSON.stringify({ error: "Nothing to update" }), {
        status: 400,
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        ...(paymentStatus && { paymentStatus }),
        ...(deliveryStatus && { deliveryStatus }),
      },
      { new: true }
    );

    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, order }), {
      status: 200,
    });
  } catch (error) {
    console.error("Order update failed:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
