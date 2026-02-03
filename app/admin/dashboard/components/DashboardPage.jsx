"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  DollarSign,
  Package,
  ArrowUpRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DashboardPage = ({ totalProducts, totalOrders, totalRevenue, totalBooking }) => {
  const [recentOrders, setRecentOrders] = useState([]);



  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard Overview
        </h1>
        <Button className="flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4" />
          View Reports
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Orders */}
        <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-700">Total Orders</CardTitle>
            <ShoppingBag className="w-6 h-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalOrders}</p>
            <p className="text-sm text-muted-foreground">Updated live</p>
          </CardContent>
        </Card>

        {/* Products */}
        <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-700">Total Products</CardTitle>
            <Package className="w-6 h-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalProducts}</p>
            <p className="text-sm text-muted-foreground">Available in store</p>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-700">Total Revenue</CardTitle>
            <DollarSign className="w-6 h-6 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              ${totalRevenue?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-muted-foreground">Total lifetime sales</p>
          </CardContent>
        </Card>
        {/* Revenue */}
        <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-700">Total Booking</CardTitle>
            {/* <DollarSign className="w-6 h-6 text-yellow-500" /> */}
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {totalBooking || 0}
            </p>
            <p className="text-sm text-muted-foreground">Total lifetime sales</p>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};

export default DashboardPage;
