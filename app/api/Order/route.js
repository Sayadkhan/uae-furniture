import { connectDB } from "@/lib/mongodb";
import Coupon from "@/model/Coupon";
import Order from "@/model/Order";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 20;

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(),
  ]);

  return Response.json({
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // 🛒 calculate subtotal
    const subtotal = body.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    let discountAmount = 0;
    let appliedCoupon = null;

    // 🎟️ check coupon if provided
    if (body.couponCode) {
      const coupon = await Coupon.findOne({
        code: body.couponCode,
        isActive: true,
      });

      if (!coupon) {
        return new Response(JSON.stringify({ error: "Invalid coupon" }), {
          status: 400,
        });
      }

      // check expiry
      if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
        return new Response(JSON.stringify({ error: "Coupon expired" }), {
          status: 400,
        });
      }

      // check minPurchase
      if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        return new Response(
          JSON.stringify({
            error: `Minimum purchase must be ${coupon.minPurchase}`,
          }),
          { status: 400 }
        );
      }

      // calculate discount
      if (coupon.discountType === "percentage") {
        discountAmount = (subtotal * coupon.discountValue) / 100;
      } else if (coupon.discountType === "fixed") {
        discountAmount = coupon.discountValue;
      }

      // prevent negative totals
      if (discountAmount > subtotal) discountAmount = subtotal;

      // snapshot coupon details
      appliedCoupon = {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        couponId: coupon._id,
      };

      // update coupon usage
      coupon.usageCount = (coupon.usageCount || 0) + 1;
      await coupon.save();
    }

    // 🧮 calculate final total (after discount)
    const totalPrice = subtotal - discountAmount;

    // 🧾 find last order to generate incremental orderId
    const lastOrder = await Order.findOne().sort({ createdAt: -1 }).lean();
    const nextOrderId = lastOrder?.orderId ? lastOrder.orderId + 1 : 1001;

    // 🛍️ create order data
    const orderData = {
      orderId: nextOrderId,
      customer: body.customer,
      items: body.items,
      shippingMethod: body.shippingMethod,
      paymentMethod: body.paymentMethod,
      subtotal,
      totalPrice,
      coupon: appliedCoupon,
    };

    const order = await Order.create(orderData);

    // ✅ return format that frontend expects
    return new Response(
      JSON.stringify({
        orderId: order.orderId,
        order,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return new Response(JSON.stringify({ error: "Error creating order" }), {
      status: 500,
    });
  }
}
