"use client";

import { useState } from "react";
import moment from "moment";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

// Payment & Delivery color mapping
const paymentColors = {
  paid: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  failed: "bg-red-100 text-red-700 border-red-200",
};

const deliveryColors = {
  delivered: "bg-green-100 text-green-700 border-green-200",
  shipped: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-gray-100 text-gray-700 border-gray-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const PAGE_SIZE = 10;

// Fetch orders API
const fetchOrders = async ({ queryKey }) => {
  const [_key, { page, search, paymentFilter, deliveryFilter }] = queryKey;
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", PAGE_SIZE);
  if (search) params.append("search", search);
  if (paymentFilter && paymentFilter !== "all")
    params.append("payment", paymentFilter);
  if (deliveryFilter && deliveryFilter !== "all")
    params.append("delivery", deliveryFilter);

  const res = await fetch(`/api/Order?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch orders
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["orders", { page: currentPage, search, paymentFilter, deliveryFilter }],
    queryFn: fetchOrders,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
  });

  // ✅ FIXED useMutation setup
  const updateMutation = useMutation({
    mutationFn: async ({ id, field, value }) => {
      const res = await fetch(`/api/Order/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: (_, { id, field, value }) => {
      queryClient.setQueryData(
        ["orders", { page: currentPage, search, paymentFilter, deliveryFilter }],
        (oldData) => {
          if (!oldData) return oldData;
          const updatedOrders = oldData.orders.map((o) =>
            o._id === id ? { ...o, [field]: value } : o
          );
          return { ...oldData, orders: updatedOrders };
        }
      );
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder((prev) => ({ ...prev, [field]: value }));
      }
    },
  });

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await fetch(`/api/Order/${id}`, { method: "DELETE" });
      queryClient.invalidateQueries(["orders"]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    updateMutation.mutate({ id, field: "deliveryStatus", value: "cancelled" });
  };

  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by customer or order ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-lg p-2 flex-1"
            />
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-lg p-2"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={deliveryFilter}
              onChange={(e) => {
                setDeliveryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-lg p-2"
            >
              <option value="all">All Deliveries</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Orders Table */}
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : data?.orders?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.orders?.map((order, index) => (
                    <TableRow key={order._id} className="hover:bg-muted/40">
                      <TableCell>{(currentPage - 1) * PAGE_SIZE + (index + 1)}</TableCell>
                      <TableCell className="font-mono text-xs">#{order.orderId}</TableCell>
                      <TableCell>{order.customer.firstName} {order.customer.lastName}</TableCell>
                      <TableCell>{order.customer.phone}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ${order.totalPrice.toFixed(2)}
                      </TableCell>

                      {/* Payment Dropdown */}
                      <TableCell>
                        <Select
                          value={order.paymentStatus}
                          onValueChange={(val) =>
                            updateMutation.mutate({ id: order._id, field: "paymentStatus", value: val })
                          }
                        >
                          <SelectTrigger className={`w-[100px] ${paymentColors[order.paymentStatus]} rounded-lg`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* Delivery Dropdown */}
                      <TableCell>
                        <Select
                          value={order.deliveryStatus === "pending" ? "processing" : order.deliveryStatus}
                          onValueChange={(val) =>
                            updateMutation.mutate({ id: order._id, field: "deliveryStatus", value: val })
                          }
                        >
                          <SelectTrigger
                            className={`w-[120px] ${
                              deliveryColors[order.deliveryStatus === "pending" ? "processing" : order.deliveryStatus]
                            } rounded-lg`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      <TableCell className="text-gray-500">
                        {moment(order.createdAt).format("MMM DD, YYYY")}
                      </TableCell>

                      <TableCell className="text-right space-x-2">
                        <Button size="icon" variant="outline" onClick={() => handleView(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() => console.log("Edit order:", order)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => handleDelete(order._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {order.deliveryStatus !== "cancelled" && (
                          <Button
                            size="icon"
                            variant="outline"
                            className="text-red-600 border-red-300"
                            onClick={() => handleCancel(order._id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>
              <span>Page {currentPage} of {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
              {isFetching && <span className="text-sm text-gray-500"> Updating...</span>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="min-w-5xl h-[85vh] space-y-6 bg-gray-50 rounded-xl shadow-xl overflow-y-scroll">
          {selectedOrder && (
            <>
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-800">
                    Order #{selectedOrder._id.slice(-6)}
                  </DialogTitle>
                  <p className="text-gray-500 text-sm mt-1">
                    Placed on {moment(selectedOrder.createdAt).format("MMM DD, YYYY")}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Close</Button>
              </div>

              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white shadow-md rounded-xl p-5 space-y-3 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Customer Info</h3>
                  <div>
                    <p className="font-medium text-gray-700">
                      {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                    </p>
                    <p className="text-gray-500 text-sm">{selectedOrder.customer.email}</p>
                    <p className="text-gray-500 text-sm">{selectedOrder.customer.phone}</p>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Shipping Address</h4>
                    <p className="text-gray-600 text-sm">
                      {selectedOrder.customer.address}, {selectedOrder.customer.city},{" "}
                      {selectedOrder.customer.country} - {selectedOrder.customer.postal}
                    </p>
                  </div>
                </div>

                <div className="bg-white shadow-md rounded-xl p-5 space-y-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Payment & Shipping</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Payment Method:</span>
                      <span className="font-medium text-gray-700">
                        {selectedOrder.paymentMethod ?? selectedOrder.payment?.method ?? "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Payment Status:</span>
                      <Select
                        value={selectedOrder.paymentStatus}
                        onValueChange={(val) =>
                          updateMutation.mutate({ id: selectedOrder._id, field: "paymentStatus", value: val })
                        }
                      >
                        <SelectTrigger className={`w-[120px] ${paymentColors[selectedOrder.paymentStatus]} rounded-lg`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Delivery Status:</span>
                      <Select
                        value={selectedOrder.deliveryStatus}
                        onValueChange={(val) =>
                          updateMutation.mutate({ id: selectedOrder._id, field: "deliveryStatus", value: val })
                        }
                      >
                        <SelectTrigger className={`w-[140px] ${deliveryColors[selectedOrder.deliveryStatus]} rounded-lg`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold text-gray-800">Items</h3>
                <div className="grid gap-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 bg-white shadow rounded-xl border border-gray-200"
                    >
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">{item.name}</p>
                        <p className="text-gray-500 text-sm">
                          {item.quantity} × ${item.price}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white shadow-md rounded-xl p-5 mt-6 border border-gray-200 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  {selectedOrder.coupon?.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>
                        Discount ({selectedOrder.coupon.code})
                      </span>
                      <span>- ${selectedOrder.coupon.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2 text-gray-800">
                    <span>Total</span>
                    <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
