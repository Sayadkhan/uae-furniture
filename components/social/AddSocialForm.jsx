"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function AddSocialForm({ onAdded }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    platform: "",
    url: "",
    icon: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "icon") {
      setForm({ ...form, icon: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("platform", form.platform);
    formData.append("url", form.url);
    if (form.icon) formData.append("icon", form.icon);

    try {
      const res = await fetch("/api/socialmedia", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Social media link added!");
        onAdded?.(data.data);
        setForm({ platform: "", url: "", icon: null });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold">Add New Social Media</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="platform"
          placeholder="Platform (e.g., Facebook)"
          value={form.platform}
          onChange={handleChange}
          required
        />
        <Input
          name="url"
          placeholder="Profile URL"
          value={form.url}
          onChange={handleChange}
          required
        />
        <div>
          <label className="text-sm font-medium">Upload Icon</label>
          <Input
            type="file"
            name="icon"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        {form.icon && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">Preview:</p>
            <img
              src={URL.createObjectURL(form.icon)}
              alt="preview"
              className="w-16 h-16 rounded-md object-cover border mt-1"
            />
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="animate-spin" /> : "Save"}
        </Button>
      </form>
    </div>
  );
}
