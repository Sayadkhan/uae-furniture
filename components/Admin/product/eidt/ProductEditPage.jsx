"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Loader2, X, PlusCircle } from "lucide-react";

export default function EditProductPage({ product, categories }) {
  const router = useRouter();

  // ✅ States
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [shortDesc, setShortDesc] = useState(product?.shortDesc || "");
  const [desc, setDesc] = useState(product?.desc || "");
  const [selectedCategory, setSelectedCategory] = useState(product?.category?._id || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(product?.subcategory?._id || "");
  const [selectedChildcategory, setSelectedChildcategory] = useState(product?.childcategory?._id || null);
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [discount, setDiscount] = useState(product?.discount || 0);
  const [discountType, setDiscountType] = useState(product?.discountType || "percentage");
  const [tags, setTags] = useState(product?.tags?.join(",") || "");
  const [mainImages, setMainImages] = useState([]);
  const [oldImages, setOldImages] = useState(product?.images || []);
  const [variants, setVariants] = useState(
    product?.variants?.length
      ? product.variants.map((v) => ({
          attributes: v.attributes,
          stock: v.stock,
          price: v.price,
          images: [],
          oldImages: v.images || [],
        }))
      : [
          {
            attributes: { color: "", hexCode: "#000000", size: "", material: "" },
            stock: 0,
            price: "",
            images: [],
            oldImages: [],
          },
        ]
  );
  const [loading, setLoading] = useState(false);

  // ✅ Auto slug
  useEffect(() => {
    if (name) {
      setSlug(
        name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  }, [name]);

  // ✅ Handlers
  const handleMainImageChange = (e) => setMainImages([...mainImages, ...Array.from(e.target.files)]);
  const removeMainImage = (i) => setMainImages(mainImages.filter((_, idx) => idx !== i));
  const removeOldImage = (i) => setOldImages(oldImages.filter((_, idx) => idx !== i));
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };
  const handleVariantAttrChange = (index, attr, value) => {
    const updated = [...variants];
    updated[index].attributes[attr] = value;
    setVariants(updated);
  };
  const handleVariantImageChange = (index, e) => {
    const updated = [...variants];
    updated[index].images = [...updated[index].images, ...Array.from(e.target.files)];
    setVariants(updated);
  };
  const removeVariantImage = (vIndex, i) => {
    const updated = [...variants];
    updated[vIndex].images = updated[vIndex].images.filter((_, idx) => idx !== i);
    setVariants(updated);
  };
  const removeVariantOldImage = (vIndex, i) => {
    const updated = [...variants];
    updated[vIndex].oldImages = updated[vIndex].oldImages.filter((_, idx) => idx !== i);
    setVariants(updated);
  };
  const addVariant = () => setVariants([...variants, { attributes: { color: "", hexCode: "#000000", size: "", material: "" }, stock: 0, price: "", images: [], oldImages: [] }]);
  const removeVariant = (i) => setVariants(variants.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("shortDesc", shortDesc);
    formData.append("desc", desc);
    formData.append("category", selectedCategory);
    formData.append("subcategory", selectedSubcategory);
    formData.append("childcategory", selectedChildcategory);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("discount", discount);
    formData.append("discountType", discountType);
    formData.append("tags", tags);
    mainImages.forEach((file) => formData.append("images", file));
    formData.append("oldImages", JSON.stringify(oldImages));
    const variantsData = variants.map((v) => ({
      attributes: v.attributes,
      stock: Number(v.stock),
      price: Number(v.price),
      oldImages: v.oldImages || [],
      images: [],
    }));
    formData.append("variants", JSON.stringify(variantsData));
    variants.forEach((variant, i) => variant.images.forEach((file) => formData.append(`variantImages_${i}`, file)));

    try {
      const res = await fetch(`/api/product/${product._id}`, { method: "PUT", body: formData });
      const data = await res.json();
      if (res.ok) {
        toast.success("✅ Product updated successfully!");
        router.push("/admin/product/all");
      } else {
        toast.error("❌ " + (data.message || "Failed to update product"));
      }
    } catch (err) {
      toast.error("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border rounded-xl bg-white">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        Edit Product
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ✅ Basic Info */}
          <section>
            <h3 className="font-semibold text-lg text-gray-700 mb-4">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <Input value={slug} readOnly />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <Input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Full Description</label>
                <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="h-28" />
              </div>
            </div>
          </section>

          {/* ✅ Categories */}
          <section>
            <h3 className="font-semibold text-lg text-gray-700 mb-4">Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubcategory(""); setSelectedChildcategory(""); }} className="border rounded-lg p-2 w-full">
                  <option value="">-- Select Category --</option>
                  {categories?.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subcategory</label>
                <select value={selectedSubcategory} onChange={(e) => { setSelectedSubcategory(e.target.value); setSelectedChildcategory(""); }} className="border rounded-lg p-2 w-full">
                  <option value="">-- Select Subcategory --</option>
                  {categories?.find(c => c._id === selectedCategory)?.subcategories?.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Child Category</label>
                <select value={selectedChildcategory} onChange={(e) => setSelectedChildcategory(e.target.value)} className="border rounded-lg p-2 w-full">
                  <option value="">-- Select Child --</option>
                  {categories?.find(c => c._id === selectedCategory)?.subcategories?.find(s => s._id === selectedSubcategory)?.childcategories?.map(child => <option key={child._id} value={child._id}>{child.name}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* ✅ Pricing & Tags */}
          <section>
            <h3 className="font-semibold text-lg text-gray-700 mb-4">Pricing & Tags</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Base Price</label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount</label>
                <Input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount Type</label>
                <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="border rounded-lg p-2 w-full">
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (BDT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Comma separated" />
              </div>
            </div>
          </section>

          {/* ✅ Product Images */}
          <section>
            <h3 className="font-semibold text-lg text-gray-700 mb-4">Product Images</h3>
            <div className="flex flex-wrap gap-3 mb-3">
              {oldImages.map((url, i) => (
                <div key={i} className="relative w-24 h-24 border rounded-lg overflow-hidden shadow-sm">
                  <img src={url} alt="old" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  <button type="button" onClick={() => removeOldImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md"><X size={14} /></button>
                </div>
              ))}
              {mainImages.map((file, i) => (
                <div key={i} className="relative w-24 h-24 border rounded-lg overflow-hidden shadow-sm">
                  <img src={URL.createObjectURL(file)} alt="new" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  <button type="button" onClick={() => removeMainImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md"><X size={14} /></button>
                </div>
              ))}
            </div>
            <Input type="file" multiple onChange={handleMainImageChange} />
          </section>

          {/* ✅ Variants */}
          <section>
            <h3 className="font-semibold text-lg text-gray-700 mb-4">Variants</h3>
            {variants.map((variant, i) => (
              <Card key={i} className="p-4 mb-4 border rounded-xl shadow-sm bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Color Name</label>
                    <Input value={variant.attributes.color} onChange={(e) => handleVariantAttrChange(i, "color", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm">Hex Code</label>
                    <Input type="color" value={variant.attributes.hexCode} onChange={(e) => handleVariantAttrChange(i, "hexCode", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm">Size</label>
                    <Input value={variant.attributes.size} onChange={(e) => handleVariantAttrChange(i, "size", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm">Material</label>
                    <Input value={variant.attributes.material} onChange={(e) => handleVariantAttrChange(i, "material", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm">Stock</label>
                    <Input type="number" value={variant.stock} onChange={(e) => handleVariantChange(i, "stock", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm">Price</label>
                    <Input type="number" value={variant.price} onChange={(e) => handleVariantChange(i, "price", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm">Variant Images</label>
                    <Input type="file" multiple onChange={(e) => handleVariantImageChange(i, e)} />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {variant.oldImages?.map((url, idx) => (
                        <div key={idx} className="relative w-20 h-20 border rounded-lg overflow-hidden">
                          <img src={url} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                          <button type="button" onClick={() => removeVariantOldImage(i, idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md"><X size={12} /></button>
                        </div>
                      ))}
                      {variant.images?.map((file, idx) => (
                        <div key={idx} className="relative w-20 h-20 border rounded-lg overflow-hidden">
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                          <button type="button" onClick={() => removeVariantImage(i, idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button type="button" variant="destructive" className="mt-4" onClick={() => removeVariant(i)}>Remove Variant</Button>
              </Card>
            ))}
            <Button type="button" className="flex items-center gap-2 mt-2" onClick={addVariant}>
              <PlusCircle size={16} /> Add Variant
            </Button>
          </section>

          {/* ✅ Submit */}
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" size="lg" className="px-6 py-2 rounded-lg" disabled={loading}>
              {loading ? <><Loader2 className="animate-spin mr-2" size={18} /> Saving...</> : "💾 Update Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
