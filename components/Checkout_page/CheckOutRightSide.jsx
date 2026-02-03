"use client";
import { useState } from "react";
import orderImg from "../../public/hero-2.jpg"
import Image from "next/image";

const CheckOutRightSide = () => {

    const [shipping, setShipping] = useState("free");
    const [payment, setPayment] = useState("bank");

  return (
    <div className="border p-6 rounded-lg">
      {/* ----------------Order Section------------- */}
      <div>
        <h2 className="text-lg font-semibold pb-3 border-b mb-10">Your order</h2>

        <div className="flex justify-between items-start border-b pb-4">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">                
              <Image src={orderImg} alt="Product" className="w-10 h-10 object-contain"/>
            </div>
            <div>
              <p className="text-[18px] font-medium"> ClosetMaid 8987 Stackable 3-Shelf Organizer</p>
              <p className="text-[17px] text-gray-500">$300</p>
            </div>
          </div>
          <span className="text-[20px] font-medium">$300</span>
        </div>

        {/* -------------Shipping-------------- */}
        <div className="border-b py-4">
          <p className="font-medium mb-3 text-[20px]">Shipping</p>
          <div className="space-y-2 text-[17px]">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={shipping === "free"}
                onChange={() => setShipping("free")}
              />
              Free shipping
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={shipping === "flat"}
                onChange={() => setShipping("flat")}
              />
              Flat rate: <span className="ml-1">$5</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={shipping === "local"}
                onChange={() => setShipping("local")}
              />
              Local pickup: <span className="ml-1">$10</span>
            </label>
          </div>
        </div>

       {/* -------------------Total-------------- */}
        <div className="flex justify-between py-4 font-semibold text-[20px]">
          <span>Total</span>
          <span>$300</span>
        </div>

        {/* --------------------Promo Code------------- */}
        <div className="bg-gray-50 p-3 rounded text-sm text-gray-500">
          Have a promo code?{" "}
          <button className="text-black underline">Click here to enter your code.</button>
        </div>
      </div>

      {/* ----------------Payment Section------------ */}
      <div className="space-y-3">
        <label className="flex flex-col gap-1 border-b pb-3">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              checked={payment === "bank"}
              onChange={() => setPayment("bank")}
            />
            <span className="font-medium">Direct bank transfer</span>
          </div>
          <p className="text-[16px] text-gray-500 mt-1">
            Make your payment directly into our bank account. Please use your
            Order ID as the payment reference. Your order will not be shipped
            until the funds have cleared in our account.
          </p>
        </label>

        <label className="flex items-center gap-2 text-[17px]">
          <input
            type="radio"
            checked={payment === "check"}
            onChange={() => setPayment("check")}
          />
          <span>Check payments</span>
        </label>

        <label className="flex items-center gap-2 text-[17px]">
          <input
            type="radio"
            checked={payment === "cod"}
            onChange={() => setPayment("cod")}
          />
          <span>Cash on delivery</span>
        </label>

        <p className="text-[16px] text-gray-500 mb-6">
          Your personal data will be used to process your order, support your
          experience throughout this website, and for other purposes described in our{" "}
          <a href="#" className="underline">
            privacy policy
          </a>.
        </p>
      </div>

     {/* ----------------Place Order Button--------------- */}
      <button className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition">
        Place Order
      </button>
    </div>
    
  )
}

export default CheckOutRightSide