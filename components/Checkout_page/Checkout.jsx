"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import countries from "world-countries";
import { useRouter } from "next/navigation";
import { clearCart } from "@/redux/slice/CartSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { formatCurrency } from "@/lib/formatCurrency";

const CheckoutPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "Bangladesh",
    address: "",
    city: "",
    postal: "",
    email: "",
    notes: "",
  });

  const countryList = countries
    .map((c) => ({ name: c.name.common, code: c.cca2 }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const dispatch = useDispatch();
  const router = useRouter();
  const { items, totalPrice } = useSelector((state) => state.cart);

  const [shipping, setShipping] = useState("free");
  const [payment, setPayment] = useState("bank");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  console.log(orderDetails)

  // useEffect(() => {
  //   if (!items || items.length === 0) router.push("/shop");
  // }, [items, router]);

  const shippingCost = shipping === "flat" ? 5 : shipping === "local" ? 10 : 0;
  const subtotal = totalPrice;
  const grandTotal = subtotal - discountAmount + shippingCost;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return toast.error("Please enter a coupon code");

    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid coupon");

      setDiscountAmount(data.discountAmount);
      setAppliedCoupon(data);
      toast.success(`Coupon "${couponCode}" applied!`);
    } catch (error) {
      toast.error(error.message);
      setDiscountAmount(0);
      setAppliedCoupon(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.postal ||
      !form.email
    ) {
      return toast.error("⚠️ Please fill all required fields");
    }

    try {
      setLoadingOrder(true);
      const res = await fetch("/api/Order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items,
          shippingMethod: shipping,
          paymentMethod: payment,
          couponCode: appliedCoupon?.code || null,
          total: grandTotal,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");



      // ✅ Show success modal
      setOrderDetails(data.order);
      setShowSuccessModal(true);
      dispatch(clearCart());
      toast.success("✅ Your order was placed successfully!");
    } catch (error) {
      console.log(error);
      toast.error("❌ Failed to place order. Try again later.");
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleOkClick = () => {
    setShowSuccessModal(false);
    router.push("/");
  };


  return (
    <div className="container mx-auto py-10 px-4 relative">
<AnimatePresence>
  {showSuccessModal && orderDetails && (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 w-[90%] max-w-lg text-center shadow-2xl border border-gray-100"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {/* 🎉 Success Header */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-green-600">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mt-1">
            Thank you for your purchase,{" "}
            <span className="font-medium">{orderDetails.customer?.firstName}</span>!
          </p>
        </div>

     <div className="grid grid-cols-2 gap-5">
         {/* 🧾 Order Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 text-left text-sm border">
          <p className="text-gray-700 font-semibold mb-2">
            🧾 Order Information
          </p>
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-medium">{orderDetails.orderId}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Total:</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(Number(orderDetails.total).toFixed(2))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment:</span>
            <span className="font-medium capitalize">
              {orderDetails.paymentMethod || "N/A"}
            </span>
          </div>
        </div>

        {/* 👤 Customer Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5 text-left text-sm border">
          <p className="text-gray-700 font-semibold mb-2">👤 Customer Details</p>
          <p>
            <span className="text-gray-500">Name:</span>{" "}
            {orderDetails.customer?.firstName} {orderDetails.customer?.lastName}
          </p>
          <p>
            <span className="text-gray-500">Phone:</span>{" "}
            {orderDetails.customer?.phone}
          </p>
          <p>
            <span className="text-gray-500">Email:</span>{" "}
            {orderDetails.customer?.email}
          </p>
          <p>
            <span className="text-gray-500">Address:</span>{" "}
            {orderDetails.customer?.address}, {orderDetails.customer?.city},{" "}
            {orderDetails.customer?.country}
          </p>
        </div>
     </div>

        {/* 🛍️ Order Items */}
        <div className="border-t border-b py-3 text-left text-sm max-h-[150px] overflow-y-auto mb-4">
          {orderDetails.items.map((item, idx) => (
            <div key={idx} className="flex justify-between mb-1">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatCurrency(Number((item.price * item.quantity).toFixed(2)))}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-5">
          <a
            href={`https://wa.me/8801700000000?text=Hi, I placed an order (${orderDetails.orderId}).`}
            target="_blank"
            className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition"
          >
            <FaWhatsapp size={20} /> Contact on WhatsApp
          </a>

          <button
            onClick={() => {
              setShowSuccessModal(false);
              router.push("/");
            }}
            className="bg-black text-white py-2 px-5 rounded-xl hover:bg-gray-800 transition"
          >
            OK
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      {/* ✅ Main Checkout Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Billing Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-2xl font-semibold mb-6">Billing details</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First name *"
                className={inputField}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last name *"
                className={inputField}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="tel"
                placeholder="Phone *"
                className={inputField}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email address *"
                className={inputField}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <select
              className={inputField}
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            >
              {countryList.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Street address *"
              className={inputField}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Town / City *"
                className={inputField}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                type="text"
                placeholder="Postcode / ZIP *"
                className={inputField}
                value={form.postal}
                onChange={(e) => setForm({ ...form, postal: e.target.value })}
              />
            </div>

            <textarea
              placeholder="Order notes (optional)"
              className={inputField}
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white border p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold pb-3 border-b mb-6">Your order</h2>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variant?._id || "base"}`}
                className="flex justify-between items-start border-b pb-3"
              >
                <div className="flex gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-md object-contain border"
                  />
                  <div>
                    <p className="text-[15px] font-medium">{item.name}</p>
                    {item.variant && (
                      <p className="text-xs text-gray-500">
                        {item.variant.attributes.color} - {item.variant.attributes.size}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-[15px] font-medium">
                  {formatCurrency(Number((item.price * item.quantity).toFixed(2)))}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Coupon code"
              className={inputField + " flex-1"}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button type="button" onClick={handleApplyCoupon} className={btnSecondary}>
              Apply
            </button>
          </div>

          <div className="border-t mt-4 pt-4 space-y-2 text-[15px]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(Number(subtotal.toFixed(2)))}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>- {formatCurrency(Number(discountAmount.toFixed(2)))}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(Number(shippingCost.toFixed(2)))}</span>
            </div>
            <div className="flex justify-between font-semibold text-[17px]">
              <span>Total</span>
              <span>{formatCurrency(Number(grandTotal.toFixed(2)))}</span>
            </div>
          </div>

          <div className="border-t py-4">
            <p className="font-medium mb-3">Shipping</p>
            <div className="space-y-2">
              {[
                { id: "free", label: "Free shipping", price: 0 },
                { id: "flat", label: "Flat rate", price: 5 },
                { id: "local", label: "Local pickup", price: 10 },
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    checked={shipping === opt.id}
                    onChange={() => setShipping(opt.id)}
                  />
                  {opt.label} {opt.price > 0 && <span className="ml-1">{formatCurrency(opt.price)}</span>}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {[
              { id: "bank", label: "Direct bank transfer" },
              { id: "check", label: "Check payments" },
              { id: "cod", label: "Cash on delivery" },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="radio"
                  checked={payment === opt.id}
                  onChange={() => setPayment(opt.id)}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loadingOrder}
            className={btnPrimary + " w-full mt-6"}
          >
            {loadingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
const inputField =
  "w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none transition";
const btnPrimary =
  "bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed";
const btnSecondary =
  "bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition cursor-pointer";

export default CheckoutPage;
