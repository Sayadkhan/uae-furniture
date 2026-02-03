"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BannerPage() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    link: "",
  });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    const res = await fetch("/api/banner");
    const data = await res.json();
    setBanners(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subtitle || !form.description || !form.link) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (image) formData.append("image", image);

    setUploading(true);
    try {
      const res = await fetch(
        editingId ? `/api/banner/${editingId}` : "/api/banner",
        {
          method: editingId ? "PATCH" : "POST",
          body: formData,
        }
      );

      if (res.ok) {
        toast.success(editingId ? "Banner updated!" : "Banner added!");
        fetchBanners();
        setForm({ title: "", subtitle: "", description: "", link: "" });
        setImage(null);
        setEditingId(null);
      } else toast.error("Operation failed!");
    } catch {
      toast.error("Server error!");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingId(banner._id);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      link: banner.link,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/banner/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Banner deleted!");
        fetchBanners();
      } else toast.error("Delete failed!");
    } catch {
      toast.error("Server error!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md p-6 rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-6">
        {editingId ? "Edit Banner" : "Add New Banner"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Input
          name="subtitle"
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={handleChange}
          required
        />
        <Textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <Input
          name="link"
          placeholder="Link (e.g. /shop)"
          value={form.link}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />

        <Button type="submit" className="w-full mt-4" disabled={uploading}>
          {uploading && <Loader2 className="animate-spin mr-2" />}
          {editingId ? "Update Banner" : "Add Banner"}
        </Button>
      </form>

      {/* Banner List */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Existing Banners</h3>
        {!loading ? (
          <>
            {banners.length === 0 ? (
              <p>No banners yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((banner) => (
                  <div
                    key={banner._id}
                    className="border rounded-lg p-3 shadow-sm relative"
                  >
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                    <h4 className="font-semibold">{banner.title}</h4>
                    <p className="text-sm text-gray-500">{banner.subtitle}</p>
                    <div className="flex gap-3 mt-3">
                      <Button size="sm" onClick={() => handleEdit(banner)}>
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(banner._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2>Loading Banners.....</h2>
          </>
        )}
      </div>
    </div>
  );
}
