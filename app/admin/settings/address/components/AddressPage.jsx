"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import AddressModal from "./AddressModal";

export default function CompanyAddress() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch company address
  const fetchAddress = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/address");
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setAddress(data.data[0]); // Take first address
      } else {
        toast.error("Failed to load company address");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Company Address</CardTitle>
          {address && (
            <AddressModal
              defaultData={address}
              onSaved={(updated) => setAddress(updated)}
            />
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : address ? (
            <div className="p-3 border rounded-lg">
              <p><strong>Name:</strong> {address.name}</p>
              <p><strong>Address:</strong> {address.addressLine}</p>
              <p><strong>City:</strong> {address.city}</p>
              <p><strong>Country:</strong> {address.country}</p>
            </div>
          ) : (
            <p>No address found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
