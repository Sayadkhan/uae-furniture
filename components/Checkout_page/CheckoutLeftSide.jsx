"use client";
import { useState } from "react";

const CheckoutLeftSide = () => {
    const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "Bangladesh",
    address: "",
    city: "",
    postal: "",
    email: "",
  });

  return (
    <div>
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-6">Billing details</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="First name *" className="w-full border p-3 rounded-lg"/>
              <input type="text" placeholder="Last name *" className="w-full border p-3 rounded-lg"/>
            </div>
            <input type="text" placeholder="Phone *" className="w-full border p-3 rounded-lg"/>
            <select className="w-full border p-3 rounded-lg">
              <option>Bangladesh</option>
              <option>India</option>
              <option>USA</option>
            </select>
            <input type="text" placeholder="Address *" className="w-full border p-3 rounded-lg"/>
            <input type="text" placeholder="Town / City *" className="w-full border p-3 rounded-lg" />            
            <input type="text" placeholder="Postcode / ZIP *" className="w-full border p-3 rounded-lg" />
            <input type="email" placeholder="Email address *" className="w-full border p-3 rounded-lg"/>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="createAccount" />
              <label htmlFor="createAccount">Create an account?</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="shipDifferent" />
              <label htmlFor="shipDifferent">Ship to a different address?</label>
            </div>
            <textarea
              placeholder="Order notes (optional)"
              className="w-full border p-3 rounded-lg"
            />
          </form>
        </div>
    </div>
  )
}

export default CheckoutLeftSide