"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";



const AllSubcategoryTable = ({ subcategories }) => {
  const [data, setData] = useState(subcategories);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;

    try {
      await fetch(`/api/subcategory/${id}`, {
        method: "DELETE",
      });
      setData((prev) => prev.filter((sc) => sc._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((subcat, index) => (
              <TableRow key={subcat._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Image
                    src={subcat.image || "/placeholder.png"}
                    alt={subcat.name}
                    width={50}
                    height={50}
                    className="rounded-md border"
                  />
                </TableCell>
                <TableCell className="font-medium">{subcat.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                  {subcat.desc || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{subcat.category?.name}</Badge>
                </TableCell>
                <TableCell className="flex gap-2">
               <Link href={`/admin/subcategories/edit/${subcat._id}`}>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(subcat._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No subcategories found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllSubcategoryTable;
