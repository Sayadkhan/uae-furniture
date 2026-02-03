"use client";
import React, { useState } from "react";
import { Eye, Check, X, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const BookingTable = ({ booking }) => {
  const [bookings, setBookings] = useState(booking || []);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteBooking, setDeleteBooking] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  console.log(booking);

  // Toggle booking status
  const handleToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, done: newStatus } : b))
    );

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update booking");
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  // Delete booking
  const handleDelete = async (id) => {
    setLoadingDelete(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete booking");
      setBookings((prev) => prev.filter((b) => b._id !== id));
      setDeleteBooking(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">All Bookings</h2>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-200">
        <table className="min-w-full table-auto">
          <thead className="bg-[#c49b63]/10">
            <tr className="text-gray-800 text-left">
              <th className="px-6 py-4 font-semibold">Sr No</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Phone</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Address</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map((b, index) => (
              <tr
                key={b._id}
                className="border-t hover:bg-gray-50 transition-all duration-200"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{b.name}</td>
                <td className="px-6 py-4">{b.phone}</td>
                <td className="px-6 py-4">{b.email}</td>
                <td className="px-6 py-4">{b.address}</td>
                <td className="px-6 py-4">
                  {b.date ? new Date(b.date).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Switch
                      checked={b.done}
                      onCheckedChange={() => handleToggle(b._id, b.done)}
                    />
                    <span
                      className={`font-medium ${
                        b.done ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {b.done ? "Done" : "Pending"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-2">
                  <Button
                    onClick={() => setSelectedBooking(b)}
                    className="bg-[#c49b63] hover:bg-[#b08b54] text-white px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> View
                  </Button>
                  <Button
                    onClick={() => setDeleteBooking(b)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for booking details */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedBooking(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Booking Details</h3>

            <div className="space-y-3 text-gray-700">
              <p><strong>Name:</strong> {selectedBooking.name}</p>
              <p><strong>Phone:</strong> {selectedBooking.phone}</p>
              <p><strong>Email:</strong> {selectedBooking.email}</p>
              <p><strong>Address:</strong> {selectedBooking.address}</p>
              <p><strong>Preferred Date:</strong> {selectedBooking.date ? new Date(selectedBooking.date).toLocaleDateString() : "-"}</p>
              {selectedBooking.description && <p><strong>Description:</strong> {selectedBooking.description}</p>}
              <p><strong>Status:</strong> {selectedBooking.done ? <span className="text-green-600 font-semibold">Done</span> : <span className="text-red-600 font-semibold">Pending</span>}</p>
              <p><strong>Created At:</strong> {new Date(selectedBooking.createdAt).toLocaleString()}</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {!selectedBooking.done && (
                <Button
                  onClick={() => {
                    handleToggle(selectedBooking._id, selectedBooking.done);
                    setSelectedBooking(null);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1" /> Mark as Done
                </Button>
              )}
              <Button onClick={() => setSelectedBooking(null)} variant="outline" className="border-gray-400">Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteBooking && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setDeleteBooking(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
            <X
              className="w-6 h-6 absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-800"
              onClick={() => setDeleteBooking(null)}
            />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to delete the booking for <strong>{deleteBooking.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => handleDelete(deleteBooking._id)}
                disabled={loadingDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loadingDelete ? "Deleting..." : "Delete"}
              </Button>
              <Button
                onClick={() => setDeleteBooking(null)}
                variant="outline"
                className="border-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;
