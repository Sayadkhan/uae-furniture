"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Loader2, Trash2, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SocialMediaPage({ social }) {
  const [links, setLinks] = useState(social || []);
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);

  // Delete handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this social media link?"))
      return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/socialmedia/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success("Deleted successfully!");
        setLinks((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error("Delete failed!");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setDeleting(null);
    }
  };

  // Toggle show/hide handler
  const handleToggleShow = async (id, currentValue) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/socialmedia/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ show: !currentValue }),
      });

      const data = await res.json();
      if (data.success) {
        setLinks((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, show: !currentValue } : item
          )
        );
        toast.success(`Show status updated`);
      } else {
        toast.error("Failed to update show status");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Globe className="w-6 h-6" /> All Social Media
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Show</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {links.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {item.platform}
                    </TableCell>
                    <TableCell>
                        {item.icon ? (
                          <div className="relative w-10 h-10">
                            <Image
                              src={item.icon}
                              alt={item.platform}
                              fill
                              className="rounded-full object-cover border"
                            />
                          </div>
                        ) : (

                        <span className="text-gray-400 italic">No Icon</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <a
                        href={item.url}
                        target="_blank"
                        className="text-blue-500 hover:underline break-all"
                      >
                        {item.url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={item.show}
                        onCheckedChange={() =>
                          handleToggleShow(item._id, item.show)
                        }
                        disabled={updating === item._id}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                        disabled={deleting === item._id}
                      >
                        {deleting === item._id ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
