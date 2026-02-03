"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";

const EditSubCategoryPage = ({ subCategory }) => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState(subCategory?.name || "");
  const [desc, setDesc] = useState(subCategory?.desc || "");
  const [category, setCategory] = useState(subCategory?.category || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(subCategory?.image || null);
  const [loading, setLoading] = useState(false);

  // Fetch all categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/category");
      const data = await res.json();
      if (res.ok) setCategories(data.category || []);
    };
    fetchCategories();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category) {
      toast.error("Name and Category are required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("category", category);
      if (image) formData.append("image", image);

      const res = await fetch(`/api/subcategory/${subCategory._id}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("SubCategory updated successfully!");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "Error updating subcategory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Edit SubCategory</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                SubCategory Name *
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Office Chairs, Coffee Tables"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Write something about this subcategory..."
              />
            </div>

            {/* Parent Category Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Parent Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-1">SubCategory Image</label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <div className="relative mt-3 w-32 h-32">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Update SubCategory"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditSubCategoryPage;
