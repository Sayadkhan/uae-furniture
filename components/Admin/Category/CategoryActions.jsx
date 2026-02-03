"use client";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";


export default function CategoryActions({ category, onDelete }) {
  const [cat, setCat] = useState(category);


  const handleToggle = async (field, value) => {
    setCat((prev) => ({ ...prev, [field]: value })); 

    try {
      await fetch(`/api/category/${cat._id}/features`, {
        method: "PATCH",
        body: JSON.stringify({ [field]: value }),
        headers: { "Content-Type": "application/json" },
      });
      toast({
        title: "Updated",
        description: `${field.replace("_", " ")} set to ${value ? "On" : "Off"}`,
      });
    } catch (err) {
      console.error(err);
      setCat((prev) => ({ ...prev, [field]: !value })); // rollback
    }
  };

  const confirmDelete = async () => {
    if (!confirm(`Delete "${cat.name}"?`)) return;
    await onDelete(cat._id);
    toast({
      title: "Deleted",
      description: `"${cat.name}" has been removed.`,
    });
  };

  return (
    <>
      <td className="text-center">
        <Switch
          checked={cat.new_arrivable}
          onCheckedChange={(checked) => handleToggle("new_arrivable", checked)}
        />
      </td>
      <td className="text-center">
        <Switch
          checked={cat.featured}
          onCheckedChange={(checked) => handleToggle("featured", checked)}
        />
      </td>
      <td className="text-center">
        <Switch
          checked={cat.top_category}
          onCheckedChange={(checked) => handleToggle("top_category", checked)}
        />
      </td>
      <td className="flex justify-center gap-2">
        <Link href={`/admin/categories/edit/${cat._id}`}>
          <Button size="sm" variant="outline" className="rounded-lg">
            Edit
          </Button>
        </Link>
        <Button
          size="sm"
          variant="destructive"
          className="rounded-lg"
          onClick={confirmDelete}
        >
          Delete
        </Button>
      </td>
    </>
  );
}
