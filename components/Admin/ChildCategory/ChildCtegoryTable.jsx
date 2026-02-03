"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const ChildCategoryPage = ({ data }) => {
  const [childCategories, setChildCategories] = useState(data || []);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  console.log(data)

  // ✅ Set loading false after initial data load
  useEffect(() => {
    if (data) {
      setChildCategories(data);
      setLoading(false);
    }
  }, [data]);

  // Delete function
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this child category?")) return;
    try {
      const res = await fetch(`/api/childcategory/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Child category deleted!");
        setChildCategories((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(result.error || "Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting child category");
    }
  };

  // Pagination
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentItems = childCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(childCategories.length / perPage);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Child Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-8 w-8" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>SubCategory</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((child, idx) => (
                      <TableRow key={child._id}>
                        <TableCell>{indexOfFirst + idx + 1}</TableCell>
                        <TableCell>{child.name}</TableCell>
                        <TableCell>{child.category?.name || "N/A"}</TableCell>
                        <TableCell>{child.subcategory?.name || "N/A"}</TableCell>
                        <TableCell className="flex justify-end space-x-2">
                          {/* Edit */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.info("Edit functionality coming soon!")}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          {/* Delete */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(child._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="5" className="text-center py-4">
                        No Child Categories Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <Button
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Prev
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildCategoryPage;
