"use client"

import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState, useEffect } from "react";
import ShopCard from "./ShopCard";
import {
  clearFilters,
  toggleCategory,
  toggleSubCategory,
  toggleChildCategory,
} from "@/redux/slice/filterSlice";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function ShopClient({ products, categories, subCategories, childCategories }) {
  const { categoryIds, subCategoryIds, childCategoryIds } = useSelector(
    (state) => state.filters
  );
  const dispatch = useDispatch();

  const [openSections, setOpenSections] = useState({
    categories: true,
    subCategories: true,
    childCategories: true,
  });
  const [filterDrawer, setFilterDrawer] = useState(false);

  const [visibleCount, setVisibleCount] = useState(9); // initially show 9 products

  const toggleSection = (section) =>
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));

  // Search states
  const [searchCat, setSearchCat] = useState("");
  const [searchSub, setSearchSub] = useState("");
  const [searchChild, setSearchChild] = useState("");

  // Sort & price filter
  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Filtered lists
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchCat.toLowerCase())
  );
  const filteredSubCategories = subCategories.filter((s) =>
    s.name.toLowerCase().includes(searchSub.toLowerCase())
  );
  const filteredChildCategories = childCategories.filter((ch) =>
    ch.name.toLowerCase().includes(searchChild.toLowerCase())
  );

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(
      (p) =>
        (categoryIds.length === 0 || categoryIds.includes(p.category._id)) &&
        (subCategoryIds.length === 0 ||
          subCategoryIds.includes(p.subcategory._id)) &&
        (!p.childcategory ||
          childCategoryIds.length === 0 ||
          childCategoryIds.includes(p.childcategory._id)) &&
        p.price >= priceRange[0] &&
        p.price <= priceRange[1]
    );

    switch (sortOption) {
      case "priceLow":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "nameAZ":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameZA":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, categoryIds, subCategoryIds, childCategoryIds, priceRange, sortOption]);

  // Infinite Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.body.offsetHeight - 300; // 300px from bottom

      if (scrollPosition >= bottomPosition && visibleCount < filteredProducts.length) {
        setVisibleCount((prev) => prev + 9); // load 9 more products
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, filteredProducts.length]);

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(9);
  }, [categoryIds, subCategoryIds, childCategoryIds, priceRange, sortOption]);

  // Active filter pills
  const renderActiveFilters = () => {
    const pills = [];

    categories
      .filter((c) => categoryIds.includes(c._id))
      .forEach((c) =>
        pills.push({ name: c.name, onRemove: () => dispatch(toggleCategory(c._id)) })
      );
    subCategories
      .filter((s) => subCategoryIds.includes(s._id))
      .forEach((s) =>
        pills.push({ name: s.name, onRemove: () => dispatch(toggleSubCategory(s._id)) })
      );
    childCategories
      .filter((ch) => childCategoryIds.includes(ch._id))
      .forEach((ch) =>
        pills.push({ name: ch.name, onRemove: () => dispatch(toggleChildCategory(ch._id)) })
      );

    return pills.length > 0 ? (
      <div className="flex flex-wrap gap-2 mb-4">
        {pills.map((pill, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-blue-200"
            onClick={pill.onRemove}
          >
            {pill.name} <X className="w-3 h-3" />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="ml-2 text-red-600 border-red-400 hover:bg-red-50"
          onClick={() => dispatch(clearFilters())}
        >
          Clear All
        </Button>
      </div>
    ) : null;
  };

  const FilterSection = ({
    title,
    items,
    selectedIds,
    toggleAction,
    searchValue,
    setSearch,
  }) => (
    <div className="mb-4 border-b border-gray-200 pb-2">
      <button
        className="flex justify-between items-center w-full font-medium text-gray-700 mb-1 hover:text-blue-600 transition"
        onClick={() => toggleSection(title)}
      >
        <span className="capitalize">{title}</span>
        {selectedIds.length > 0 && (
          <span className="text-sm text-blue-600">({selectedIds.length})</span>
        )}
        {openSections[title] ? <ChevronDown /> : <ChevronRight />}
      </button>
      {openSections[title] && (
        <div className="space-y-1">
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchValue}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 text-sm"
          />
          <div className="max-h-44 overflow-y-auto space-y-1">
            {items.length > 0 ? (
              items.map((item) => (
                <label
                  key={item._id}
                  className="flex items-center gap-2 cursor-pointer text-sm hover:bg-gray-50 p-1 rounded transition"
                >
                  <Checkbox
                    checked={selectedIds.includes(item._id)}
                    onCheckedChange={() => dispatch(toggleAction(item._id))}
                  />
                  {item.name}
                </label>
              ))
            ) : (
              <p className="text-xs text-gray-400 px-1">No match found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block md:w-1/4 sticky top-4 self-start space-y-4">
        <Button className="w-full mb-2" onClick={() => dispatch(clearFilters())}>
          Clear Filters
        </Button>

        {/* Price Filter */}
        <div className="mb-4 border-b border-gray-200 pb-2">
          <span className="font-medium text-gray-700 mb-1 block">Price Range</span>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={priceRange[0]}
              min={0}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="text-sm"
            />
            <span>-</span>
            <Input
              type="number"
              value={priceRange[1]}
              min={0}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="text-sm"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="mb-4 border-b border-gray-200 pb-2">
          <span className="font-medium text-gray-700 mb-1 block">Sort By</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full text-sm p-1 border rounded"
          >
            <option value="default">Default</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="nameAZ">Name: A → Z</option>
            <option value="nameZA">Name: Z → A</option>
          </select>
        </div>

        <FilterSection
          title="categories"
          items={filteredCategories}
          selectedIds={categoryIds}
          toggleAction={toggleCategory}
          searchValue={searchCat}
          setSearch={setSearchCat}
        />
        <FilterSection
          title="subCategories"
          items={filteredSubCategories}
          selectedIds={subCategoryIds}
          toggleAction={toggleSubCategory}
          searchValue={searchSub}
          setSearch={setSearchSub}
        />
        <FilterSection
          title="childCategories"
          items={filteredChildCategories}
          selectedIds={childCategoryIds}
          toggleAction={toggleChildCategory}
          searchValue={searchChild}
          setSearch={setSearchChild}
        />
      </aside>

      
      {/* Mobile Filter Drawer */}
      <div className="md:hidden">
        <Button className="w-full mb-4" onClick={() => setFilterDrawer(true)}>
          Filters
        </Button>
        {filterDrawer && (
          <div         onClick={() => setFilterDrawer(false)} className="fixed inset-0 z-50 bg-black/40 flex">
            <div className="w-4/5 max-w-sm bg-white h-full p-4 overflow-y-auto shadow-lg animate-slideIn relative">
            <div className="">
                  <Button
                    // variant="ghost"
                    className="absolute top-4 right-4"
                    onClick={() => setFilterDrawer(false)}
                  >
                    <X />
                  </Button>
                  {/* Filters same as desktop */}
                  <Button
                    className="w-full mb-4"
                    onClick={() => dispatch(clearFilters())}
                  >
                    Clear Filters
                  </Button>
            </div>

              {/* Price & Sort */}
              <div className="mb-4 border-b border-gray-200 pb-2">
                <span className="font-medium text-gray-700 mb-1 block">Price Range</span>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={priceRange[0]}
                    min={0}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="text-sm"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    min={0}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="mb-4 border-b border-gray-200 pb-2">
                <span className="font-medium text-gray-700 mb-1 block">Sort By</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full text-sm p-1 border rounded"
                >
                  <option value="default">Default</option>
                  <option value="priceLow">Price: Low → High</option>
                  <option value="priceHigh">Price: High → Low</option>
                  <option value="nameAZ">Name: A → Z</option>
                  <option value="nameZA">Name: Z → A</option>
                </select>
              </div>

              <FilterSection
                title="categories"
                items={filteredCategories}
                selectedIds={categoryIds}
                toggleAction={toggleCategory}
                searchValue={searchCat}
                setSearch={setSearchCat}
              />
              <FilterSection
                title="subCategories"
                items={filteredSubCategories}
                selectedIds={subCategoryIds}
                toggleAction={toggleSubCategory}
                searchValue={searchSub}
                setSearch={setSearchSub}
              />
              <FilterSection
                title="childCategories"
                items={filteredChildCategories}
                selectedIds={childCategoryIds}
                toggleAction={toggleChildCategory}
                searchValue={searchChild}
                setSearch={setSearchChild}
              />
            </div>
          </div>
        )}
      </div>

      {/* Product Area */}
      <main className="flex-1">
        {renderActiveFilters()}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.slice(0, visibleCount).map((p) => <ShopCard key={p._id} product={p} />)
          ) : (
            <p className="col-span-full text-center text-gray-500 mt-4">
              No products found.
            </p>
          )}
        </div>

        {/* Optional loading indicator */}
        {visibleCount < filteredProducts.length && (
          <p className="text-center mt-4 text-gray-500">Scroll down to load more...</p>
        )}
      </main>

    </div>
  );
}
