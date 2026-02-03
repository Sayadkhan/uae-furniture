"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";

const CouponListPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/coupon?page=${page}&limit=${limit}`);
      const data = await res.json();
      setCoupons(data.data);
      setTotal(data.meta.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const res = await fetch(`/api/coupon/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert("Failed to delete coupon");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <Card className="shadow-md border rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            🎟️ Coupons
          </CardTitle>
          <Link href="/admin/coupons/add">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Coupon
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Code</TableHead>
                  <TableHead className="font-semibold text-gray-700">Discount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Min Purchase</TableHead>
                  <TableHead className="font-semibold text-gray-700">Expiry</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <Loader2 className="w-6 h-6 animate-spin inline-block text-gray-500" />
                      <p className="text-gray-500 mt-2">Loading coupons...</p>
                    </TableCell>
                  </TableRow>
                ) : coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      No coupons found
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => (
                    <TableRow
                      key={coupon._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-mono font-semibold text-gray-800">
                        {coupon.code}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : `৳${coupon.discountValue}`}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {coupon.minPurchase || "-"}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {coupon.isActive ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Link href={`/admin/coupons/edit/${coupon._id}`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(coupon._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              variant="outline"
              className="rounded-full"
            >
              ⬅ Previous
            </Button>
            <span className="text-gray-600 font-medium">
              Page {page} of {totalPages || 1}
            </span>
            <Button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((prev) => prev + 1)}
              variant="outline"
              className="rounded-full"
            >
              Next ➡
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CouponListPage;
