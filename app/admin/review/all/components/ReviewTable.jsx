"use client";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ReviewModal from "./ReviewModal";


const ReviewTable = ({ review }) => {

  
  // Local state for instant updates
  const [reviewsData, setReviewsData] = useState(review || []);
  const [selectedReview, setSelectedReview] = useState(null);

  console.log(selectedReview)

  // Toggle approval status
  const handleApproveToggle = async (reviewId, currentStatus) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/approve`, {
        method: "PATCH",
        body: JSON.stringify({ approved: !currentStatus }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);

        // Update local state immediately
        setReviewsData((prev) =>
          prev.map((r) =>
            r._id === reviewId ? { ...r, approved: !currentStatus } : r
          )
        );
      } else {
        toast.error(data.message || "Failed to update review status");
      }
    } catch (error) {
      toast.error("Error updating review status");
      console.error(error);
    }
  };

  // Delete review
  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);

        // Remove from local state immediately
        setReviewsData((prev) => prev.filter((r) => r._id !== reviewId));
      } else {
        toast.error(data.message || "Failed to delete review");
      }
    } catch (error) {
      toast.error("Error deleting review");
      console.error(error);
    }
  };

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>All Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reviewsData && reviewsData.length > 0 ? (
              reviewsData.map((review) => (
                <TableRow key={review._id}>
                  <TableCell>{review.name}</TableCell>
                  <TableCell>{review.email || "-"}</TableCell>
                  <TableCell>⭐ {review.rating}</TableCell>
                  <TableCell>
                    <Switch
                      checked={review.approved}
                      onCheckedChange={() =>
                        handleApproveToggle(review._id, review.approved)
                      }
                    />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedReview(review)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(review._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No reviews found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Review Details Modal */}
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </Card>
  );
};

export default ReviewTable;
