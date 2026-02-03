"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { X, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const tabs = [
  { id: "description", label: "Description" },
  { id: "reviews", label: "Reviews" },
  { id: "size", label: "Size Chart" },
  { id: "image", label: "Image Gallery" },
];

const ProductsTabs = ({ product, reviews = [] }) => {
  const [active, setActive] = useState("reviews");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [thankYouModal, setThankYouModal] = useState(false);
  const imageRef = useRef(null);

  const images = product?.images || [];
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 5);

  // Modal functions
  const openModal = (img) => {
    setSelectedImage(img);
    setModalOpen(true);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setDragStart(null);
  };

  // Drag & touch handlers
  const handleMouseDown = (e) => { e.preventDefault(); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }); };
  const handleMouseMove = (e) => { if (!dragStart) return; setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setDragStart(null);
  const handleTouchStart = (e) => { if (e.touches.length === 1) { const touch = e.touches[0]; setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y }); } };
  const handleTouchMove = (e) => { if (!dragStart || e.touches.length !== 1) return; const touch = e.touches[0]; setPosition({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y }); };
  const handleTouchEnd = () => setDragStart(null);

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.email || !newReview.rating || !newReview.comment) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/product/${product._id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newReview, productId: product._id }),
      });
      if (res.ok) {
        setNewReview({ name: "", email: "", rating: 0, comment: "" });
        setThankYouModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, clickable = false) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} ${clickable ? "cursor-pointer" : ""}`}
        onClick={() => clickable && setNewReview({ ...newReview, rating: i + 1 })}
      />
    ));

  const gravatar = (email) => `https://www.gravatar.com/avatar/${email ? email.trim().toLowerCase() : ''}?d=identicon&s=40`;

  return (
    <div className="pb-10">
      <div className="border rounded-md bg-white">
        {/* Tabs */}
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-5 py-3 text-[18px] sm:text-[20px] whitespace-nowrap transition-colors ${
                active === tab.id
                  ? "border-b-2 border-black font-medium text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab.id === "reviews" ? `${tab.label} (${reviews.length})` : tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 space-y-6">
          {active === "description" && <div className="text-gray-700">{product?.desc}</div>}

          {/* Reviews */}
          {active === "reviews" && (
            <div className="space-y-4">
              {visibleReviews.length > 0 ? (
                visibleReviews.map((r, i) => (
                  <div key={i} className="border rounded-lg p-4 bg-gray-50 shadow-sm flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={gravatar(r.email)}
                        width={40}
                        height={40}
                        alt={r.name}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{r.name}</h3>
                        <div className="flex mt-1">{renderStars(r.rating)}</div>
                        <p className="text-gray-400 text-xs mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2 sm:mt-0">{r.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}

              {reviews.length > 5 && !showAllReviews && (
                <button
                  onClick={() => setShowAllReviews(true)}
                  className="text-blue-600 hover:underline mt-2"
                >
                  See More Reviews
                </button>
              )}

              {/* Review Form */}
              <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full border px-3 py-2 rounded-md focus:ring-1 focus:ring-black focus:border-black"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={newReview.email}
                      onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                      className="w-full border px-3 py-2 rounded-md focus:ring-1 focus:ring-black focus:border-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Rating *</label>
                    <div className="flex items-center gap-1">{renderStars(newReview.rating, true)}</div>
                  </div>
                  <textarea
                    placeholder="Your Review *"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full border px-3 py-2 rounded-md focus:ring-1 focus:ring-black focus:border-black h-28 resize-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {active === "size" && <p className="text-gray-700">Size chart content.</p>}

          {/* Image Gallery */}
          {active === "image" && (
            <>
              {images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg overflow-hidden shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => openModal(img)}
                    >
                      <Image
                        src={img}
                        alt={`${product.name}-image-${idx}`}
                        width={400}
                        height={500}
                        className="w-full h-60 object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No images available.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Zoom Modal */}
      {modalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white z-50 p-2 rounded-full bg-black/50 hover:bg-black/70"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute top-4 left-4 flex gap-2 z-50">
              <button
                onClick={() => setZoom((prev) => Math.min(prev + 0.5, 5))}
                className="bg-white px-3 py-1 rounded-md shadow hover:bg-gray-100"
              >
                +
              </button>
              <button
                onClick={() => setZoom((prev) => Math.max(prev - 0.5, 1))}
                className="bg-white px-3 py-1 rounded-md shadow hover:bg-gray-100"
              >
                -
              </button>
            </div>

            <div
              className="overflow-hidden rounded-lg"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{ cursor: zoom > 1 ? "grab" : "default" }}
            >
              <Image
                ref={imageRef}
                src={selectedImage}
                alt="Product Large"
                width={800}
                height={800}
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transition: dragStart ? "none" : "transform 0.3s",
                }}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      <Dialog open={thankYouModal} onOpenChange={() => setThankYouModal(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Thank You!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4 flex flex-col gap-2">
         <span>
             Thank you for submitting your review. It will appear soon
         </span>
            <button
              onClick={() => setThankYouModal(false)}
              className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTabs;
