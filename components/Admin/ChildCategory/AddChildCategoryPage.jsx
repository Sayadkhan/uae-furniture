"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AddChildCategoryPage({ categorySubcategory }) {

  console.log(categorySubcategory)

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize categories from prop
  useEffect(() => {
    if (categorySubcategory?.length > 0) {
      setCategories(categorySubcategory);
    }
  }, [categorySubcategory]);

  // Update subcategories when category changes
  useEffect(() => {
    if (!category) {
      setSubCategories([]);
      return;
    }
    const selectedCat = categories.find((c) => c._id === category);
    setSubCategories(selectedCat?.subcategories || []);
  }, [category, categories]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !subCategory) {
      toast.error("Name, Category and SubCategory are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/childcategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, subCategory }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("ChildCategory added successfully!");
        setName("");
        setCategory("");
        setSubCategory("");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "Error adding child category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Add New ChildCategory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                ChildCategory Name *
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gaming Laptops, Study Tables"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Parent Category *
              </label>
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

            {/* SubCategory Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Parent SubCategory *
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full border rounded-md p-2"
                disabled={!category}
              >
                <option value="">Select SubCategory</option>
                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Add ChildCategory"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
