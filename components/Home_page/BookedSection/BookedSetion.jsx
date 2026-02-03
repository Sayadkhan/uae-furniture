"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { toast } from "react-toastify";

const BookedSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    date: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to submit booking");
      
      // Show thank you modal
      setShowModal(true);
      setFormData({
        name: "",
        address: "",
        email: "",
        phone: "",
        date: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 bg-gradient-to-br from-[#faf8f6] to-[#f1efed]">
      <div className="container mx-auto lg:px-12 flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-16">
        
        {/* Left Content */}
        <div className="lg:w-1/2 md:text-left space-y-6 md:mx-5">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Book a <span className="text-[#c49b63]">Free Visit</span> Today
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
            Whether you’re furnishing your{" "}
            <span className="font-semibold text-gray-900">Home</span>,{" "}
            <span className="font-semibold text-gray-900">Hotel</span>,{" "}
            <span className="font-semibold text-gray-900">Restaurant</span>,{" "}
            <span className="font-semibold text-gray-900">Bar</span>, or{" "}
            <span className="font-semibold text-gray-900">Office</span> — our expert team
            is ready to help. Book a{" "}
            <strong>free measurement visit</strong> or send us a quick message on WhatsApp
            to get started.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-2 border-[#c49b63] text-[#c49b63] px-8 py-5 text-lg rounded-full font-medium hover:bg-[#c49b63] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="mx-10 lg:w-1/2 w-full bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Book Your Free Visit
          </h3>
          <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-5">
              <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c49b63] outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c49b63] outline-none transition-all"
                required
              />
            </div>
        </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 w-full">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c49b63] outline-none transition-all"
                  required
                />
              </div>

              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c49b63] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Preferred Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c49b63] outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us a bit about your furniture needs..."
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#c49b63] outline-none transition-all resize-none"
              ></textarea>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c49b63] hover:bg-[#b08b54] text-white text-lg py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? "Submitting..." : "Submit Now"}
            </Button>
          </form>
        </div>
      </div>

      {/* Thank You Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative text-center">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
              onClick={() => setShowModal(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You!
            </h2>
            <p className="text-gray-700 text-lg">
              Your booking has been received successfully. Our team will contact you shortly.
            </p>
            <Button
              className="mt-6 bg-[#c49b63] hover:bg-[#b08b54] text-white w-full py-4 rounded-full"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookedSection;
