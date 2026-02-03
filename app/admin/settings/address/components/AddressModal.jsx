"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function AddressModal({ onSaved, defaultData }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    addressLine: "",
    city: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  // Populate form for edit
  useEffect(() => {
    if (defaultData) {
      setForm(defaultData);
      setOpen(true);
    }
  }, [defaultData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (form._id) {
        // Edit existing
        res = await fetch(`/api/address/${form._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        // Add new
        res = await fetch(`/api/address`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      const data = await res.json();
      if (data.success) {
        toast.success(`Address ${form._id ? "updated" : "added"} successfully!`);
        onSaved?.(data.data);
        setOpen(false);
        setForm({
          name: "",
          phone: "",
          email: "",
          addressLine: "",
          city: "",
          postalCode: "",
          country: "",
          isDefault: false,
        });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{form._id ? "Edit Address" : "Add Address"}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{form._id ? "Edit Address" : "Add New Address"}</DialogTitle>
        </DialogHeader>

        <form className="space-y-3 mt-2" onSubmit={handleSubmit}>
          <Input
            name="name"
            placeholder="Name (Home, Office)"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            name="addressLine"
            placeholder="Address Line"
            value={form.addressLine}
            onChange={handleChange}
            required
          />
          <Input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />
          <Input
            name="postalCode"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={handleChange}
          />
          <Input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            required
          />

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
