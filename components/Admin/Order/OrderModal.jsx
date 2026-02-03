import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import moment from 'moment';
import React from 'react'

const OrderModal = ({selectedOrder, isModalOpen,setIsModalOpen }) => {
  return (
    <div>
      <div className="">
        <Dialog className="" open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="min-w-5xl h-[85vh] space-y-6 bg-gray-50 rounded-xl shadow-xl overflow-y-scroll">
          {selectedOrder && (
            <>
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-800">
                    Order #{selectedOrder._id.slice(-6)}
                  </DialogTitle>
                  <p className="text-gray-500 text-sm mt-1">
                    Placed on {moment(selectedOrder.createdAt).format("MMM DD, YYYY")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
              </div>

              {/* Horizontal Stepper Timeline */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Status</h3>
                <div className="flex items-center justify-between relative">
                  {["processing", "shipped", "delivered"].map((step, idx, arr) => {
                    const statusOrder = ["processing", "shipped", "delivered"];
                    const currentIndex = statusOrder.indexOf(selectedOrder.deliveryStatus);
                    const stepIndex = statusOrder.indexOf(step);
                    const isCompleted = stepIndex < currentIndex;
                    const isCurrent = stepIndex === currentIndex;
                    const isCancelled = selectedOrder.deliveryStatus === "cancelled";

                    return (
                      <div key={step} className="flex-1 flex flex-col items-center relative">
                        {/* Circle */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg mb-2 shadow-md
                            ${
                              isCancelled
                                ? "bg-red-500 text-white"
                                : isCompleted
                                ? "bg-green-600 text-white"
                                : isCurrent
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-300 text-gray-600"
                            }`}
                        >
                          {idx + 1}
                        </div>
                        {/* Label */}
                        <span className="text-sm font-medium capitalize text-gray-700">{step}</span>

                        {/* Connecting Line */}
                        {idx !== arr.length - 1 && (
                          <div
                            className={`absolute top-5 left-1/2 transform -translate-x-1/2 w-full h-1 z-0
                              ${
                                isCancelled
                                  ? "bg-red-400"
                                  : isCompleted
                                  ? "bg-green-500"
                                  : isCurrent
                                  ? "bg-yellow-400"
                                  : "bg-gray-300"
                              }`}
                            style={{ width: "100%", height: "4px", zIndex: 0 }}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {selectedOrder.deliveryStatus === "cancelled" && (
                  <p className="text-red-600 text-sm mt-4 font-semibold text-center">
                    This order has been cancelled ❌
                  </p>
                )}
              </div>

              {/* Customer & Payment Info */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Customer Info Card */}
                <div className="bg-white shadow-md rounded-xl p-5 space-y-3 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Customer Info</h3>
                  <div>
                    <p className="font-medium text-gray-700">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                    <p className="text-gray-500 text-sm">{selectedOrder.customer.email}</p>
                    <p className="text-gray-500 text-sm">{selectedOrder.customer.phone}</p>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Shipping Address</h4>
                    <p className="text-gray-600 text-sm">
                      {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.country} - {selectedOrder.customer.postal}
                    </p>
                  </div>
                </div>

                {/* Payment & Shipping Card */}
                <div className="bg-white shadow-md rounded-xl p-5 space-y-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Payment & Shipping</h3>

                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Payment Method:</span>
                      <span className="font-medium text-gray-700">{selectedOrder.paymentMethod ?? selectedOrder.payment?.method ?? "N/A"}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Payment Status:</span>
                      <Select
                        value={selectedOrder.paymentStatus}
                        onValueChange={(val) => updateOrderStatus(selectedOrder._id, "paymentStatus", val)}
                      >
                        <SelectTrigger className={`w-[120px] ${paymentColors[selectedOrder.paymentStatus]} rounded-lg`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid" className={paymentColors.paid}>Paid</SelectItem>
                          <SelectItem value="pending" className={paymentColors.pending}>Pending</SelectItem>
                          <SelectItem value="failed" className={paymentColors.failed}>Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Delivery Status:</span>
                      <Select
                        value={selectedOrder.deliveryStatus}
                        onValueChange={(val) => updateOrderStatus(selectedOrder._id, "deliveryStatus", val)}
                      >
                        <SelectTrigger className={`w-[140px] ${deliveryColors[selectedOrder.deliveryStatus]} rounded-lg`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="processing" className={deliveryColors.processing}>Processing</SelectItem>
                          <SelectItem value="shipped" className={deliveryColors.shipped}>Shipped</SelectItem>
                          <SelectItem value="delivered" className={deliveryColors.delivered}>Delivered</SelectItem>
                          <SelectItem value="cancelled" className={deliveryColors.cancelled}>Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedOrder.trackingNumber && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Tracking:</span>
                        <span className="font-medium text-gray-700">{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold text-gray-800">Items</h3>
                <div className="grid gap-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-white shadow rounded-xl border border-gray-200">
                      <img src={item.image || '/placeholder.png'} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">{item.name}</p>
                        <p className="text-gray-500 text-sm">{item.quantity} × ${item.price}</p>
                      </div>
                      <p className="font-semibold text-gray-800">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-white shadow-md rounded-xl p-5 mt-6 border border-gray-200 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                {selectedOrder.coupon?.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount ({selectedOrder.coupon.code})</span>
                    <span>- ${selectedOrder.coupon.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2 text-gray-800">
                  <span>Total</span>
                  <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
</div>
    </div>
  )
}

export default OrderModal
