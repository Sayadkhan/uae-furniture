"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

const AddCouponPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    expiryDate: "",
    isActive: true,
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!form.code.trim()) return "Coupon code is required";
    if (!form.discountValue || Number(form.discountValue) <= 0)
      return "Discount value must be greater than 0";
    if (!form.expiryDate) return "Expiry date is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to create coupon",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success 🎉",
          description: "Coupon created successfully!",
        });
        router.push("/admin/coupons/all");
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl py-5">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Add New Coupon
          </CardTitle>
          <p className="text-sm text-gray-500">
            Fill in the details below to create a new coupon.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Coupon Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                placeholder="e.g., SAVE20"
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Discount Type & Value */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={form.discountType}
                  onValueChange={(value) => handleChange("discountType", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value</Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="1"
                  placeholder={
                    form.discountType === "percentage" ? "20 (%)" : "100 (৳)"
                  }
                  value={form.discountValue}
                  onChange={(e) =>
                    handleChange("discountValue", e.target.value)
                  }
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Minimum Purchase */}
            <div className="space-y-2">
              <Label htmlFor="minPurchase">Minimum Purchase (Optional)</Label>
              <Input
                id="minPurchase"
                type="number"
                placeholder="500"
                value={form.minPurchase}
                onChange={(e) => handleChange("minPurchase", e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Active Switch */}
            <div className="flex items-center justify-between border p-3 rounded-lg">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
                disabled={loading}
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Add Coupon"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCouponPage;
