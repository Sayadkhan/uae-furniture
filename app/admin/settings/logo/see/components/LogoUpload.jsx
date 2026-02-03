"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Loader2, Trash2, UploadCloud } from "lucide-react";

export default function LogoPage() {
  const [logo, setLogo] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchLogo = async () => {
    try {
      const res = await fetch("/api/logo");
      const data = await res.json();
      if (data.success) setLogo(data.data);
    } catch {
      toast.error("Failed to fetch logo");
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/logo", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) {
        setLogo(result.data);
        toast.success("Logo updated successfully!");
      } else toast.error("Upload failed");
    } catch {
      toast.error("Network error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete the logo?")) return;
    try {
      const res = await fetch("/api/logo", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setLogo(null);
        toast.success("Logo deleted successfully");
      } else toast.error(data.message || "Delete failed");
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 ">
      <Card className="w-full max-w-lg shadow-lg border border-gray-200">
        <CardHeader className="py-2 text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Company Logo
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Upload or manage your brand logo
          </p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center gap-6 py-6">
            {/* Logo Preview */}
            <div className="relative w-40 h-40 flex items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white shadow-inner hover:shadow-md transition">
              {logo?.imageUrl ? (
                <img
                  src={logo.imageUrl}
                  alt="Logo"
                  className="w-full h-full object-contain p-3 rounded-2xl"
                />
              ) : (
                <div className="text-gray-400 text-sm flex flex-col items-center">
                  <UploadCloud className="w-10 h-10 mb-2 opacity-70" />
                  No Logo Uploaded
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                  <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
                </div>
              )}
            </div>

            {/* Upload Button */}
            <label className="w-full">
              <div className="flex flex-col items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition shadow-sm">
                <UploadCloud className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600 font-medium">
                  {uploading ? "Uploading..." : "Choose Logo File"}
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Delete Button */}
            {logo?.imageUrl && (
              <Button
                variant="destructive"
                className="flex items-center gap-2 w-full"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                Delete Logo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
