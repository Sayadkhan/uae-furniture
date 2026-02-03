"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  toggleCategory,
  toggleChildCategory,
  toggleSubCategory,
} from "@/redux/slice/filterSlice";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NavbarClient = ({ categories, curtains, sofas }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [openSubCategory, setOpenSubCategory] = useState(null);

  const handleCategoryClick = (id) => {
    dispatch(toggleCategory(id));
    router.push("/shop");
    setMenuOpen(false);
  };

  const handleSubCategoryClick = (id) => {
    dispatch(toggleSubCategory(id));
    router.push("/shop");
    setMenuOpen(false);
  };

  const handleChildCategoryClick = (id) => {
    dispatch(toggleChildCategory(id));
    router.push("/shop");
    setMenuOpen(false);
  };

  const toggleCategoryMenu = (catId) => {
    setOpenCategory(openCategory === catId ? null : catId);
    setOpenSubCategory(null);
  };

  const toggleSubMenu = (subId) => {
    setOpenSubCategory(openSubCategory === subId ? null : subId);
  };

  return (
    <nav className="sticky top-0 z-30 shadow-md bg-[#f5f2ee]">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Desktop Menu */}
        <div className="hidden xl:flex gap-8 text-black items-center mx-auto">
          {/* Curtains Dropdown */}
          {curtains && (
            <div className="relative group cursor-pointer">
              <Link href={`/curtains`}>
                <button className="text-[18px] font-medium hover:text-gray-800 transition flex items-center gap-1 capitalize cursor-pointer">
                  {curtains.name || "Curtains"}
                  <span className="text-sm">&#9662;</span>
                </button>
              </Link>

              {curtains.subcategories?.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-[250px] bg-[#6b3e2e] text-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <ul className="py-2">
                    {curtains.subcategories.map((sub) => (
                      <li key={sub._id}>
                        <Link href={`/curtains/${sub._id}`}>
                          <button className="w-full text-left px-4 py-2 text-[15px] hover:bg-[#8b5a3d] capitalize cursor-pointer">
                            {sub.name}
                          </button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {sofas && (
            <div className="relative group cursor-pointer">
              <Link href={`/sofas`}>
                <button className="text-[18px] font-medium hover:text-gray-800 transition flex items-center gap-1 capitalize cursor-pointer">
                  {sofas.name || "Curtains"}
                  <span className="text-sm">&#9662;</span>
                </button>
              </Link>

              {sofas.subcategories?.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-[250px] bg-[#6b3e2e] text-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <ul className="py-2">
                    {sofas.subcategories.map((sub) => (
                      <li key={sub._id}>
                        <Link href={`/sofas/${sub._id}`}>
                          <button className="w-full text-left px-4 py-2 text-[15px] hover:bg-[#8b5a3d] capitalize cursor-pointer">
                            {sub.name}
                          </button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}



          {/* Other Categories */}
          {categories.slice(0, 5).map((cat) => (
            <div key={cat._id} className="relative group cursor-pointer">
              <button
                onClick={() => handleCategoryClick(cat._id)}
                className="text-[18px] font-medium hover:text-gray-800 transition capitalize cursor-pointer"
              >
                {cat.name}
              </button>

              {cat.subcategories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-[700px] bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-6">
                  <div className="grid grid-cols-3 gap-6">
                    {cat.subcategories.slice(0, 4).map((sub) => (
                      <div key={sub._id}>
                        <h4
                          className="text-gray-900 font-bold mb-2 cursor-pointer hover:text-gray-700"
                          onClick={() => handleSubCategoryClick(sub._id)}
                        >
                          {sub.name}
                        </h4>
                        <ul className="space-y-1">
                          {sub.childcategories?.slice(0, 5).map((child) => (
                            <li key={child._id}>
                              <button
                                onClick={() => handleChildCategoryClick(child._id)}
                                className="text-gray-600 hover:text-black text-sm"
                              >
                                {child.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link
            href="/shop"
            className="text-[18px] font-medium hover:text-gray-800 text-[#8b5a3d] underline"
          >
            More
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="xl:hidden text-black ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 90, damping: 15 }}
              className="fixed top-0 left-0 w-[80%] h-full bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">Browse Categories</h2>
                <button onClick={() => setMenuOpen(false)}>
                  <X size={26} />
                </button>
              </div>


        <div className="p-4 space-y-6">
          {/* Curtains Section */}
          {curtains && (
            <div className="border-b border-gray-200 pb-3">
              <button
                onClick={() => toggleCategoryMenu("curtains")}
                className="w-full text-left text-[18px] font-semibold py-2 flex justify-between items-center text-gray-900"
              >
                {curtains.name || "Curtains"}
                {openCategory === "curtains" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              <AnimatePresence>
                {openCategory === "curtains" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pl-3 border-l border-gray-200 ml-2"
                  >
                    {curtains.subcategories?.map((sub) => (
                      <div key={sub._id} className="mt-1">
                        <button
                          onClick={() => toggleSubMenu(sub._id)}
                          className="w-full text-left text-[15px] font-medium py-1 flex justify-between items-center text-gray-700"
                        >
                          {sub.name}
                          {openSubCategory === sub._id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>

                        <AnimatePresence>
                          {openSubCategory === sub._id && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-4 space-y-1 pb-2"
                            >
                              {sub.childcategories?.map((child) => (
                                <li key={child._id}>
                                  <button
                                    onClick={() => handleChildCategoryClick(child._id)}
                                    className="text-gray-600 text-sm hover:text-black"
                                  >
                                    {child.name}
                                  </button>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Furniture Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 underline mb-3">
              Furniture
            </h2>

            <div className="space-y-1">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="border-b border-gray-100 pb-1 last:border-none"
                >
                  <button
                    onClick={() => toggleCategoryMenu(cat._id)}
                    className="w-full text-left text-[17px] font-medium py-2 flex justify-between items-center text-gray-800"
                  >
                    {cat.name}
                    {openCategory === cat._id ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>

                  <AnimatePresence>
                    {openCategory === cat._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-3 border-l border-gray-200 ml-2"
                      >
                        {cat.subcategories.map((sub) => (
                          <div key={sub._id} className="mt-1">
                            <button
                              onClick={() => toggleSubMenu(sub._id)}
                              className="w-full text-left text-[15px] font-medium py-1 flex justify-between items-center text-gray-700"
                            >
                              {sub.name}
                              {openSubCategory === sub._id ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>

                            <AnimatePresence>
                              {openSubCategory === sub._id && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="pl-4 space-y-1 pb-2"
                                >
                                  {sub.childcategories?.map((child) => (
                                    <li key={child._id}>
                                      <button
                                        onClick={() => handleChildCategoryClick(child._id)}
                                        className="text-gray-600 text-sm hover:text-black"
                                      >
                                        {child.name}
                                      </button>
                                    </li>
                                  ))}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="block text-[17px] font-semibold py-3 text-[#8b5a3d] underline text-center"
          >
            More
          </Link>
        </div>


            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarClient;
