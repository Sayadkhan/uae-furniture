"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Tag,
  Layers,
  Ticket,
  User,
  MapPin,
  Image as ImageIcon,
  Globe,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Products",
    icon: Package,
    children: [
      { href: "/admin/product/all", label: "All Products" },
      { href: "/admin/product/add", label: "Add Product" },
    ],
  },
  {
    label: "Categories",
    icon: Tag,
    children: [
      { href: "/admin/categories/all", label: "All Categories" },
      { href: "/admin/categories/add", label: "Add Category" },
    ],
  },
  {
    label: "Subcategories",
    icon: Layers,
    children: [
      { href: "/admin/subcategories/all", label: "All Subcategories" },
      { href: "/admin/subcategories/add", label: "Add Subcategory" },
    ],
  },
  {
    label: "Childcategories",
    icon: Layers,
    children: [
      { href: "/admin/childcategory/all", label: "All childcategory" },
      { href: "/admin/childcategory/add", label: "Add childcategory" },
    ],
  },
  {
    label: "Coupons",
    icon: Ticket,
    children: [
      { href: "/admin/coupons/all", label: "All Coupons" },
      { href: "/admin/coupons/add", label: "Add Coupon" },
    ],
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    children: [{ href: "/admin/order/all", label: "All Orders" }],
  },
  {
    label: "Booking",
    icon: ShoppingCart,
    children: [{ href: "/admin/booking/all", label: "All Booking" }],
  },
  {
    label: "Reviews",
    icon: ShoppingCart,
    children: [{ href: "/admin/review/all", label: "All Review" }],
  },
  {
    label: "Social Links",
    icon: Ticket,
    children: [
      { href: "/admin/social/all", label: "All Social Media" },
      { href: "/admin/social/add", label: "Add Social Media" },
    ],
  },
  {
    label: "Banner",
    icon: Ticket,
    children: [{ href: "/admin/banner/add", label: "Add Home Banner" }],
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      {
        label: "Address",
        icon: MapPin,
        children: [{ href: "/admin/settings/address/add", label: "Address" }],
      },
      {
        label: "Logo",
        icon: ImageIcon,
        children: [{ href: "/admin/settings/logo/see", label: "Logo" }],
      },
      {
        label: "Whatsapp",
        icon: ImageIcon,
        children: [{ href: "/admin/whatsapp", label: "Whatsapp" }],
      },
    ],
  },
];

function SidebarItem({ item, pathname, openMenus, toggleMenu, parent = null }) {
  const { href, label, icon: Icon, children } = item;
  const isOpen = parent ? openMenus[parent]?.[label] : openMenus[label];
  const active = href && pathname === href;

  if (children) {
    return (
      <div>
        <button
          onClick={() => toggleMenu(label, parent)}
          className={`flex w-full items-center justify-between px-3 py-2 rounded-lg transition-all
            ${
              isOpen
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon size={20} />}
            <span>{label}</span>
          </div>
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        <div
          className={`ml-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          {children.map((child) =>
            child.children ? (
              <SidebarItem
                key={child.label}
                item={child}
                pathname={pathname}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                parent={label}
              />
            ) : (
              <Link
                key={child.href}
                href={child.href}
                className={`block px-3 py-2 rounded-md text-sm transition
                  ${
                    pathname === child.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {child.label}
              </Link>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
        ${
          active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      {Icon && <Icon size={20} />}
      <span>{label}</span>
    </Link>
  );
}

export default function Admin({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState({});
  const [profileOpen, setProfileOpen] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch("/api/admin/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setAdmin(data.admin);
      } catch (err) {
        console.error("Failed to fetch admin info:", err);
      }
    };
    fetchAdmin();
  }, []);

  const toggleMenu = (label, parent = null) => {
    setOpenMenus((prev) => {
      if (parent) {
        const parentState = prev[parent] || {};
        const newParentState = { ...parentState };
        Object.keys(newParentState).forEach((key) => {
          if (key !== label) newParentState[key] = false;
        });
        newParentState[label] = !newParentState[label];
        return { ...prev, [parent]: newParentState };
      }

      const newState = {};
      Object.keys(prev).forEach((key) => {
        if (key !== label) newState[key] = false;
      });
      newState[label] = !prev[label];
      return newState;
    });
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) return <div className="min-h-screen w-full">{children}</div>;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col border-r">
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-lg font-bold text-gray-800">Furniture Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarLinks.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              pathname={pathname}
              openMenus={openMenus}
              toggleMenu={toggleMenu}
            />
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-600 hover:text-red-800 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6 border-b">
          <h2 className="text-base font-semibold text-gray-800">Admin Panel</h2>

          <div className="flex gap-5 items-center justify-center">
            <a target="_blank" href={"/"}>
              <Globe className="w-6 h-6 text-gray-700 hover:text-gray-900" />
            </a>

            <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2"
                >
                  <div className="relative w-9 h-9">
                    <Image
                      src={admin?.profile || "/admin-avatar.png"}
                      alt="Admin"
                      fill
                      className="rounded-full border object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:inline">
                    {admin?.name || "Admin"}
                  </span>
                </button>


              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border">
                  <Link
                    prefetch={false}
                    href="/admin/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <User size={16} /> Profile
                  </Link>
                  <div className="w-full border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 flex-1">{children}</div>
      </main>
    </div>
  );
}
