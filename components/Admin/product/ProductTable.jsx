"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Table, TableBody, TableHead, TableHeader, TableRow, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const fetchProducts = async ({ queryKey }) => {
  const [_key, { page, search, category }] = queryKey;
  const res = await fetch(`/api/product?page=${page}&limit=10&search=${search}&category=${category}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

const ProductTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loadingId, setLoadingId] = useState(null);
  const queryClient = useQueryClient();

  // ✅ Fetch paginated products
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["products", { page, search, category }],
    queryFn: fetchProducts,
    keepPreviousData: true,
    staleTime: 5000,
  });

  console.log(data);

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  // ✅ Toggle mutation (featured/newarrivable/topsell)
  const toggleMutation = useMutation({
    mutationFn: async ({ id, field, value }) => {
      const res = await fetch(`/api/product/${id}/features`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onMutate: ({ id, field, value }) => {
      setLoadingId(id);
      queryClient.setQueryData(["products", { page, search, category }], (old) => {
        if (!old) return old;
        return {
          ...old,
          products: old.products.map((p) =>
            p._id === id ? { ...p, [field]: value } : p
          ),
        };
      });
    },
    onError: () => toast.error("❌ Failed to update product"),
    onSettled: () => setLoadingId(null),
    onSuccess: () => {
      toast.success("✅ Updated successfully");
      queryClient.invalidateQueries(["products"]);
    },
  });

  // ✅ Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/product/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      toast.success("✅ Product deleted");
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => toast.error("❌ Failed to delete product"),
  });

  const handleToggle = (id, field, value) => {
    toggleMutation.mutate({ id, field, value });
  };

  const handleDelete = (id) => {
    const confirmDelete = confirm("Are you sure?");
    if (confirmDelete) deleteMutation.mutate(id);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">🪑 Furniture Products</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <Input
          placeholder="🔍 Search furniture..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="max-w-xs bg-white border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400"
        />
        <Select value={category} onValueChange={(val) => { setPage(1); setCategory(val); }}>
          <SelectTrigger className="w-[220px] bg-white border-gray-300 rounded-xl shadow-sm">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {[...new Set(products.map((p) => p.category?.name))].map(
              (cat) =>
                cat && (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                )
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
        <Table>
          <TableHeader className="bg-amber-50">
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>New Arrival</TableHead>
              <TableHead>Top Sell</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan="9" className="text-center py-10">
                  Loading products...
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product._id} className="hover:bg-amber-50/40 transition-colors">
                  <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                  <TableCell>
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={70}
                        height={70}
                        className="rounded-xl object-cover shadow-sm"
                      />
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name || "—"}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <Switch
                      checked={product.featured}
                      disabled={loadingId === product._id}
                      onCheckedChange={(val) => handleToggle(product._id, "featured", val)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.newarrivable}
                      disabled={loadingId === product._id}
                      onCheckedChange={(val) => handleToggle(product._id, "newarrivable", val)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.topsell}
                      disabled={loadingId === product._id}
                      onCheckedChange={(val) => handleToggle(product._id, "topsell", val)}
                    />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Link href={`/admin/product/edit/${product._id}`}>
                      <Button size="sm" variant="outline" className="text-blue-600">
                        <Pencil className="w-4 h-4" /> Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleDelete(product._id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <Button
          disabled={page === 1 || isFetching}
          onClick={() => setPage((p) => p - 1)}
          variant="outline"
          className="bg-white rounded-lg shadow-sm hover:bg-amber-50"
        >
          ← Previous
        </Button>
        <span className="text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={page === totalPages || isFetching}
          onClick={() => setPage((p) => p + 1)}
          variant="outline"
          className="bg-white rounded-lg shadow-sm hover:bg-amber-50"
        >
          Next →
        </Button>
      </div>
    </div>
  );
};

export default ProductTable;
