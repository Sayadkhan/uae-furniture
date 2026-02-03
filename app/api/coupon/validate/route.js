import { connectDB } from "@/lib/mongodb";
import Coupon from "@/model/Coupon";

export async function POST(req) {
  try {
    await connectDB();
    const { code, subtotal } = await req.json();

    if (!code) {
      return new Response(JSON.stringify({ error: "Coupon code required" }), {
        status: 400,
      });
    }

    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) {
      return new Response(JSON.stringify({ error: "Invalid coupon" }), {
        status: 400,
      });
    }

    // Expiry check
    if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
      return new Response(JSON.stringify({ error: "Coupon expired" }), {
        status: 400,
      });
    }

    // Min purchase check
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return new Response(
        JSON.stringify({
          error: `Minimum purchase must be $${coupon.minPurchase}`,
        }),
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (subtotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    }

    if (discountAmount > subtotal) discountAmount = subtotal;

    // Return coupon snapshot
    const responseData = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
    };

    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return new Response(JSON.stringify({ error: "Error validating coupon" }), {
      status: 500,
    });
  }
}
