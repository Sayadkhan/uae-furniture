
import OrdersPage from "@/components/Admin/Order/OrderTable";
import { connectDB } from "@/lib/mongodb";
import Order from "@/model/Order";
import React from "react";

async function getAllOrder() {
  await connectDB();
  const allOrder = await Order.find({}).sort({ createdAt: -1 }).lean();

  return JSON.parse(JSON.stringify(allOrder));
}


export const dynamic = 'force-dynamic';

const OrderTable = async () => {
  const allOrder = await getAllOrder();
  return (
    <div>
      <OrdersPage allOrder={allOrder} />
    </div>
  );
};

export default OrderTable;
