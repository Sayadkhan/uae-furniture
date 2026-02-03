"use client";

import React, { Suspense, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import CategoryRow from "./CategoryRow";

const AllCategoryTable = ({ category }) => {
  const [categories, setCategories] = useState(category || []);

  // optimistic delete handler
  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    const prev = [...categories];
    setCategories((prev) => prev.filter((c) => c._id !== id));

    try {
      const res = await fetch(`/api/category/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
      setCategories(prev); // rollback on error
    }
  };

  return (
    <Card className="overflow-hidden shadow-md border rounded-2xl">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">New Arrivable</TableHead>
              <TableHead className="text-center">Featured</TableHead>
              <TableHead className="text-center">Top Category</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat, i) => (
              <Suspense
                key={cat._id}
                fallback={
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading {cat.name}...
                    </TableCell>
                  </TableRow>
                }
              >
                <CategoryRow
                  category={cat}
                  index={i}
                  onDelete={handleDelete} // pass delete handler
                />
              </Suspense>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default AllCategoryTable;
