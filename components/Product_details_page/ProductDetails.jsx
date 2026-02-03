"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Star, Heart } from "lucide-react";
import Image from "next/image";
import ProductsTabs from "./ProductsTabs";
import { toast } from "react-toastify";
import { addToCart } from "@/redux/slice/CartSlice";
import { formatCurrency } from "@/lib/formatCurrency";
import { useQuery } from "@tanstack/react-query";

const ProductDetails = ({ product, userId, reviews }) => {

      const { data, isLoading, isError } = useQuery({
        queryKey: ["whatsapp-number"],
        queryFn: async () => {
          const res = await fetch("/api/whatsapp");
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        },
        staleTime: 5 * 60 * 1000,
      });
    
      if (isLoading || isError || !data?.number) return null;
    
      const number = data.number; 

  const dispatch = useDispatch();
  const [numberCount, setNumberCount] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const getDiscountedPrice = (price) => {
    if (!product?.discount || product?.discount <= 0) return price;
    return product?.discountType === "percentage"
      ? price - (price * product?.discount) / 100
      : price - product?.discount;
  };

  const activePrice = selectedVariant ? selectedVariant?.price : product?.price;
  const activeStock = selectedVariant ? selectedVariant?.stock : product?.stock;
  const discountedPrice = getDiscountedPrice(activePrice);

  const images = selectedVariant?.images?.length
    ? selectedVariant.images
    : product?.images || [];

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setNumberCount(1);
    setActiveImageIndex(0);
  };

  const handleAddToCart = () => {
    if (product?.variants?.length > 0 && !selectedVariant) {
      toast.error("⚠️ Please select a variant first");
      return;
    }
    if (activeStock < 1) {
      toast.error("❌ This item is out of stock");
      return;
    }

    dispatch(
      addToCart({
        userId: userId || "guest",
        productId: product?._id,
        name: product?.name,
        price: discountedPrice,
        quantity: numberCount,
        variant: selectedVariant,
        image: images[activeImageIndex],
      })
    );

    toast.success(
      `✅ Added ${numberCount} x ${
        selectedVariant?.attributes?.color || product?.name
      } to cart`
    );
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto  md:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          {/* Left: Image Gallery */}
          <div
            className={
              images.length > 1
                ? "grid grid-cols-1 sm:grid-cols-[18%_82%] gap-3"
                : "flex justify-center"
            }
          >
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex sm:flex-col flex-row sm:gap-2 gap-3 justify-center sm:mt-0 mt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 border rounded-md overflow-hidden cursor-pointer transition ${
                      activeImageIndex === idx
                        ? "border-black ring-2 ring-gray-400"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={product?.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative w-full h-[350px] sm:h-[420px] md:h-[500px] lg:h-[550px] border border-gray-200 rounded-lg overflow-hidden">
              {images.length > 0 ? (
                <Image
                  src={images[activeImageIndex]}
                  alt={product?.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="px-1 sm:px-2 md:px-0">
            <p className="text-gray-500 mb-1">
              Category:{" "}
              <span className="font-medium text-gray-700">
                {product?.category?.name}
              </span>
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold leading-snug">
              {product?.name}
            </h1>

            {/* Price & Rating */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-semibold text-black">
                {formatCurrency(discountedPrice)}
              </span>
              {product?.discount > 0 && (
                <span className="line-through text-gray-400">
                  {formatCurrency(activePrice)}
                </span>
              )}
           {product?.averageRating > 0 && (
            
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(product?.averageRating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-500" />
                ))}
                <span className="text-gray-600 ml-1 sm:ml-2 text-sm">
                  {reviews.length}
                </span>
              </div>
           )
             
           }
            </div>

            {/* Stock */}
            <div
              className={`mt-4 py-2 px-4 rounded-md inline-block text-sm font-medium ${
                activeStock > 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {activeStock > 0
                ? `In stock: ${activeStock}`
                : "Out of stock!"}
            </div>

            {/* Short Description */}
            <p className="mt-4 text-gray-700 text-sm sm:text-base leading-relaxed">
              {product?.shortDesc}
            </p>

            {/* Variants */}
            {product?.variants?.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-medium text-lg">Options:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant._id}
                      onClick={() => handleVariantSelect(variant)}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 border rounded-md transition text-sm sm:text-base ${
                        selectedVariant?._id === variant._id
                          ? "border-black bg-gray-100"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border"
                        style={{
                          backgroundColor:
                            variant.attributes?.hexCode || "#ccc",
                        }}
                      ></span>
                      <span className="font-medium">
                        {variant.attributes?.color} -{" "}
                        {variant.attributes?.size}
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm ml-1 sm:ml-2">
                        {formatCurrency(variant.price)} | {variant.stock} left
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* whatsapp button */}

      <div className="w-full lg:w-96 mt-5">
               {/* WhatsApp Button */}
        <div className="py-10">
              <a
              href={`https://wa.me/${number}?text=Hi, I am interested in ${product?.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition text-sm sm:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.52 3.48A11.89 11.89 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.07 1.52 5.78L0 24l6.42-1.68A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.25-6.2-3.48-8.52zM12 22a10 10 0 0 1-5.22-1.44l-.37-.22-3.81.99.99-3.81-.22-.37A10 10 0 1 1 22 12a10 10 0 0 1-10 10zm5.16-7.05c-.28-.14-1.65-.81-1.9-.9s-.43-.14-.61.14-.7.9-.86 1.09-.32.21-.59.07c-.28-.14-1.18-.44-2.25-1.38-.83-.74-1.39-1.65-1.55-1.93s-.02-.43.12-.57c.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.1-.18.05-.33-.02-.46-.07-.14-.61-1.48-.84-2.03-.22-.53-.45-.46-.61-.46-.16 0-.35-.02-.54-.02s-.46.07-.7.33c-.24.26-.91.88-.91 2.14s.93 2.48 1.06 2.65c.14.16 1.84 2.83 4.46 3.97 2.62 1.14 2.62.76 3.09.71.46-.05 1.5-.61 1.71-1.2.21-.59.21-1.1.14-1.21-.07-.12-.25-.18-.53-.32z" />
              </svg>
              Message Now
            </a>
        </div>
            </div>

       {/* Quantity + Add To Cart + WhatsApp */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 ">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setNumberCount(Math.max(1, numberCount - 1))}
                className="px-3 py-1 text-lg"
              >
                –
              </button>
              <span className="px-4">{numberCount}</span>
              <button
                onClick={() =>
                  setNumberCount(Math.min(activeStock, numberCount + 1))
                }
                className="px-3 py-1 text-lg"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-5 sm:px-6 py-2 rounded-md hover:bg-gray-800 transition text-sm sm:text-base"
            >
              Add To Cart
            </button>

            <button className="flex items-center gap-2 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition text-sm sm:text-base">
              <Heart className="w-4 h-4" /> Wishlist
            </button>

          </div>

          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-10">
          <ProductsTabs product={product} images={images} reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
