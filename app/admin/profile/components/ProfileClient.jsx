"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const ProfileClient = ({ data }) => {
  const [admin, setAdmin] = useState(data);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    password: "", // ✅ current password for confirming changes
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(URL.createObjectURL(file));
  };

  // ✅ Upload profile image
  const handleUpload = async () => {
    const file = document.getElementById("imageUpload").files[0];
    if (!file) return toast.error("Please select an image first");

    const fd = new FormData();
    fd.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
      const result = await res.json();
      if (res.ok) {
        setAdmin((prev) => ({ ...prev, image: result.imageUrl }));
        toast.success("Profile image updated successfully");
        setSelectedImage(null);
      } else toast.error(result.error || "Upload failed");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update name/email (requires password)
  const handleProfileUpdate = async () => {
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      return toast.error("All fields including current password are required");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await res.json();
      if (res.ok) {
        setAdmin(result.admin);
        toast.success("Profile updated successfully");
        setEditing(false);
        setFormData({ ...formData, password: "" });
      } else {
        toast.error(result.error || "Update failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error("New passwords do not match");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else toast.error(data.error || "Password update failed");
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 mt-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-6 rounded-t-2xl">
        <h2 className="text-2xl font-semibold">Admin Profile</h2>
        <p className="text-sm opacity-90 mt-1">Manage your account details</p>
      </div>

      {/* Profile Section */}
      <div className="p-8 flex flex-col md:flex-row items-center gap-10">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <Image
              src={selectedImage || admin?.profile || "/default-avatar.png"}
              alt="Profile"
              fill
              className="rounded-full object-cover border-4 border-blue-100 shadow-sm"
            />
          </div>

          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <div className="mt-4 flex flex-col w-full">
            <Button
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => document.getElementById("imageUpload").click()}
            >
              Choose Image
            </Button>

            {selectedImage && (
              <Button
                onClick={handleUpload}
                disabled={loading}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                {loading ? "Uploading..." : "Upload"}
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              readOnly={!editing}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`mt-1 ${editing ? "border-blue-500 bg-white" : "bg-gray-100"}`}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={formData.email}
              readOnly={!editing}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`mt-1 ${editing ? "border-blue-500 bg-white" : "bg-gray-100"}`}
            />
          </div>

          {editing && (
            <div className="sm:col-span-2">
              <Label>Confirm Current Password</Label>
              <Input
                type="password"
                placeholder="Enter current password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-1 border-blue-500 bg-white"
              />
            </div>
          )}

          <div className="sm:col-span-2 flex gap-2 mt-2">
            {!editing ? (
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleProfileUpdate}
                  disabled={loading}
                >
                  {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({ name: admin.name, email: admin.email, password: "" });
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="border-t px-8 py-8 bg-gray-50 rounded-b-2xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Change Password
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input
              type="password"
              placeholder="Enter current password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              placeholder="Re-enter new password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfileClient;
