"use client";
import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star } from "lucide-react";

const ReviewModal = ({ review, onClose }) => {
  if (!review) return null;

  const product = review.product || {};
  const productImage = product.images?.[0] || null;

  return (
    <Dialog open={!!review} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Review Info */}
          <p>
            <strong>Name:</strong> {review.name}
          </p>
          <p>
            <strong>Email:</strong> {review.email || "N/A"}
          </p>
          <p className="flex items-center">
            <strong>Rating:</strong>
            <span className="ml-2 flex text-yellow-500">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={16} fill="gold" />
              ))}
            </span>
          </p>
          <p>
            <strong>Comment:</strong>
            <br />
            {review.comment}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {review.approved ? "✅ Approved" : "❌ Pending"}
          </p>

          {/* Product Info */}
          {product && (
            <>
              <hr className="my-2" />
              {/* Product Image */}
              {productImage && (
                <div className="w-full h-48 relative mb-2 rounded-lg overflow-hidden">
                  <Image
                    src={productImage}
                    alt={product.name || "Product Image"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p>
                <strong>Product Name:</strong> {product.name || "N/A"}
              </p>
           
           
              <p>
                <strong>Price:</strong> ${product.price?.toFixed(2) || "0.00"}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock || 0}
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
