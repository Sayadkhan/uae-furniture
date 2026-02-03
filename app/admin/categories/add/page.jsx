"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { Loader2, X, UploadCloud } from "lucide-react";

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [icon, setIcon] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewIcon, setPreviewIcon] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle image/icon selection
  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "image") {
        setImage(file);
        setPreviewImage(URL.createObjectURL(file));
      } else {
        setIcon(file);
        setPreviewIcon(URL.createObjectURL(file));
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      if (image) formData.append("image", image);
      if (icon) formData.append("icon", icon);

      const res = await fetch("/api/category", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("✅ Category added successfully!");
        setName("");
        setDesc("");
        setImage(null);
        setIcon(null);
        setPreviewImage(null);
        setPreviewIcon(null);
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "Error adding category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <Card className="w-full max-w-4xl shadow-xl border border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            🗂️ Add New Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sofa, Table, Chair"
                  className="focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Description
                </label>
                <Textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Write something about this category..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Image */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Category Image
                </label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 hover:bg-gray-50 transition">
                  {!previewImage ? (
                    <>
                      <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm mb-2">
                        Drag & drop or click to upload
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "image")}
                      />
                    </>
                  ) : (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Category Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setPreviewImage(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Icon Upload */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Category Icon
                </label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 hover:bg-gray-50 transition">
                  {!previewIcon ? (
                    <>
                      <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm mb-2">
                        Upload category icon
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "icon")}
                      />
                    </>
                  ) : (
                    <div className="relative">
                      <img
                        src={previewIcon}
                        alt="Icon Preview"
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIcon(null);
                          setPreviewIcon(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Add Category"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
