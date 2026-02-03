"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAdmin } from "@/redux/slice/adminSlice";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const dispatch = useDispatch();


const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
    
      const meRes = await fetch("/api/admin/me", { credentials: "include" });
      const meData = await meRes.json();

      if (meData.success) {
        dispatch(setAdmin(meData.admin));
        router.push("/admin/dashboard"); 
      } else {
        toast.error("Failed to fetch admin info after login");
      }
    } else {
      setError(data.error || "Login failed");
    }
  } catch (err) {
    setError(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
  <div className="">
      <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-yellow-700 text-white flex-col justify-center items-center p-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to FurniAdmin 👋</h1>
        <p className="text-lg">
          Manage your furniture store easily. Track products, orders, and stock from a single place.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex flex-1 justify-center items-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Admin Login</h2>

          {error && (
            <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-700 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-700 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-700 text-white py-2 rounded-lg hover:bg-yellow-800 transition disabled:opacity-50 font-medium"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            &copy; 2025 YourFurniture. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
  );
}
