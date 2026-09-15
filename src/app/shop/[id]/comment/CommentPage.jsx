"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import Link from "next/link";

const RATING_LABELS = {
  5: "5.0 - Outstanding Masterpiece ⭐⭐⭐⭐⭐",
  4: "4.0 - Very Good Quality ⭐⭐⭐⭐",
  3: "3.0 - Good & Satisfactory ⭐⭐⭐",
  2: "2.0 - Fair Experience ⭐⭐",
  1: "1.0 - Needs Improvement ⭐",
};

export default function CommentPage({ artworkId, user, onStatsChange }) {
  const id = artworkId;

  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 5.0,
    ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    photoReviewsCount: 0,
    photoReviews: [],
  });

  // Form State
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Status & Edit State
  const [isPurchased, setIsPurchased] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingRating, setEditingRating] = useState(5);
  const [editingPhotos, setEditingPhotos] = useState([]);
  const [editPhotoInput, setEditPhotoInput] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);

  // Lightbox Modal for Photo Review
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  // Delete Confirmation Modal
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  // Fetch comments and check purchase status
  const loadComments = async () => {
    if (!id) return;
    try {
      setCommentsLoading(true);
      const res = await fetch(`${baseUrl}/api/artworks/${id}/comments`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setComments(data);
        } else if (data.comments) {
          setComments(data.comments);
          if (data.stats) {
            setStats(data.stats);
            if (onStatsChange) onStatsChange(data.stats);
          }
        }
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const checkPurchase = async () => {
    if (!id || (!user?.id && !user?.email)) return;
    try {
      const query = user?.id ? `userId=${encodeURIComponent(user.id)}` : `email=${encodeURIComponent(user.email)}`;
      const res = await fetch(`${baseUrl}/api/artworks/${id}/purchased-check?${query}`);
      if (res.ok) {
        const data = await res.json();
        setIsPurchased(Boolean(data.purchased));
      }
    } catch (err) {
      console.error("Error checking purchase status:", err);
    }
  };

  useEffect(() => {
    loadComments();
    checkPurchase();
  }, [id, user?.id, user?.email]);

  // Photo handlers for new review
  const handleAddPhoto = () => {
    if (!photoUrlInput.trim()) return;
    if (reviewPhotos.length >= 4) {
      showToast("Maximum 4 delivery photos allowed per review.", "error");
      return;
    }
    setReviewPhotos([...reviewPhotos, photoUrlInput.trim()]);
    setPhotoUrlInput("");
  };

  const handleRemovePhoto = (index) => {
    setReviewPhotos(reviewPhotos.filter((_, i) => i !== index));
  };

  // Photo handlers for editing review
  const handleAddEditPhoto = () => {
    if (!editPhotoInput.trim()) return;
    if (editingPhotos.length >= 4) {
      showToast("Maximum 4 delivery photos allowed per review.", "error");
      return;
    }
    setEditingPhotos([...editingPhotos, editPhotoInput.trim()]);
    setEditPhotoInput("");
  };

  const handleRemoveEditPhoto = (index) => {
    setEditingPhotos(editingPhotos.filter((_, i) => i !== index));
  };

  // Submit new review
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      setSubmittingReview(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${baseUrl}/api/artworks/${id}/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: user.id || "",
          userEmail: user.email || "",
          userName: user.name || "Verified Collector",
          userImage: user.image || "",
          rating: rating,
          comment: newComment.trim(),
          reviewImages: reviewPhotos,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("Your review and star rating were published!");
        setNewComment("");
        setRating(5);
        setReviewPhotos([]);
        setPhotoUrlInput("");
        await loadComments();
      } else {
        showToast(data.error || "Failed to post review.", "error");
      }
    } catch (err) {
      console.error("Error adding review:", err);
      showToast("Error posting review. Please try again.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Start editing
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.comment || "");
    setEditingRating(comment.rating || 5);
    setEditingPhotos(Array.isArray(comment.reviewImages) ? [...comment.reviewImages] : comment.reviewImage ? [comment.reviewImage] : []);
    setEditPhotoInput("");
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
    setEditingPhotos([]);
    setEditPhotoInput("");
  };

  // Save edited review
  const handleSaveEdit = async (commentId) => {
    if (!editingText.trim() || !user) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${baseUrl}/api/comments/${commentId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          userId: user.id || "",
          userEmail: user.email || "",
          comment: editingText.trim(),
          rating: editingRating,
          reviewImages: editingPhotos,
        }),
      });

      if (res.ok) {
        showToast("Review updated successfully!");
        setEditingCommentId(null);
        await loadComments();
      } else {
        showToast("Failed to save review changes.", "error");
      }
    } catch (err) {
      console.error("Error editing review:", err);
      showToast("Failed to save changes.", "error");
    }
  };

  // Delete review
  const handleConfirmDelete = async () => {
    if (!deleteModalId) return;

    try {
      setIsDeleting(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${baseUrl}/api/comments/${deleteModalId}?userId=${user?.id || ""}&email=${encodeURIComponent(user?.email || "")}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        showToast("Review deleted successfully");
        setDeleteModalId(null);
        await loadComments();
      } else {
        showToast("Failed to delete review.", "error");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      showToast("Error deleting review", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div id="collector-reviews-section" className="border-t border-white/5 mt-12 pt-10 space-y-8 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border transition-all duration-300 ${
            toast.type === "error"
              ? "bg-[#1c1111] border-red-500/50 text-red-200"
              : "bg-[#161616] border-[#D4AF37]/40 text-white"
          }`}
        >
          <div className={`p-1 rounded-lg ${toast.type === "error" ? "bg-red-500/20 text-red-400" : "bg-[#D4AF37]/15 text-[#D4AF37]"}`}>
            <Icon icon={toast.type === "error" ? "solar:danger-circle-bold" : "solar:check-circle-bold"} className="size-5" />
          </div>
          <div className="text-sm font-semibold tracking-wide">{toast.message}</div>
        </div>
      )}

      {/* --- SECTION HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl text-[#D4AF37]">
            <Icon icon="solar:stars-minimalistic-bold-duotone" className="size-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              Collector Reviews & Ratings
              <span className="text-xs bg-[#D4AF37]/20 text-[#FFE58F] font-bold px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                {stats.totalReviews} {stats.totalReviews === 1 ? "Review" : "Reviews"}
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Verified collector ratings and real doorstep delivery photos of this artwork.
            </p>
          </div>
        </div>

        {isPurchased && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0">
            <Icon icon="solar:verified-check-bold" className="size-4" />
            Verified Buyer Account
          </span>
        )}
      </div>

      {/* --- RATINGS BREAKDOWN & PHOTO GALLERY SUMMARY CARD --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-b from-[#141414] to-[#0D0D0D] border border-white/5 rounded-3xl p-6 sm:p-7 shadow-xl">
        {/* Left: Overall Score (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-center items-center text-center p-4 border-b lg:border-b-0 lg:border-r border-white/5 space-y-2">
          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]">
            {stats.averageRating.toFixed(1)}
          </span>
          
          <div className="flex items-center gap-1 text-[#D4AF37]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                icon="solar:star-bold"
                className={`size-5 ${
                  star <= Math.round(stats.averageRating) ? "text-[#D4AF37]" : "text-gray-700"
                }`}
              />
            ))}
          </div>

          <p className="text-xs font-semibold text-gray-300">
            Based on {stats.totalReviews} {stats.totalReviews === 1 ? "collector review" : "collector reviews"}
          </p>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">
            100% Authentic Buyer Feedback
          </span>
        </div>

        {/* Middle: Star Bars (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-2 px-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = stats.ratingCounts?.[stars] || 0;
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

            return (
              <div key={stars} className="flex items-center gap-2 text-xs">
                <span className="w-7 text-gray-400 font-bold flex items-center gap-0.5">
                  {stars} <Icon icon="solar:star-bold" className="size-3 text-[#D4AF37]" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-[#1F1F1F] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-500 font-mono text-[11px]">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Delivery Photo Gallery Strip (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between p-2 border-t lg:border-t-0 lg:border-l border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="solar:camera-bold-duotone" className="size-4 text-[#D4AF37]" />
              Delivery Photos ({stats.photoReviews?.length || 0})
            </h4>
          </div>

          {stats.photoReviews && stats.photoReviews.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {stats.photoReviews.slice(0, 4).map((photo, i) => (
                <div
                  key={i}
                  onClick={() => setActiveLightboxImg(photo)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-[#1A1A1A] border border-white/10 hover:border-[#D4AF37] transition-all cursor-pointer group"
                >
                  <img src={photo} alt="Customer delivery photo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Icon icon="solar:magnifer-zoom-in-bold" className="size-4 text-[#D4AF37]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#181818] border border-dashed border-white/5 text-center text-xs text-gray-500 flex flex-col items-center justify-center gap-1">
              <Icon icon="solar:gallery-minimalistic-linear" className="size-5 text-gray-600" />
              <span>No delivery photos shared yet</span>
            </div>
          )}

          <p className="text-[11px] text-gray-500 leading-tight">
            Photos uploaded by collectors who have unboxed & installed this artwork.
          </p>
        </div>
      </div>

      {/* --- REVIEW SUBMISSION FORM (FOR VERIFIED BUYERS) --- */}
      {isPurchased ? (
        <div className="bg-gradient-to-b from-[#181818] to-[#121212] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
          <div className="border-b border-white/5 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Icon icon="solar:pen-new-square-bold-duotone" className="size-5 text-[#D4AF37]" />
                Write a Verified Collector Review
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Share your star rating and photo of the artwork in your gallery or space.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddReview} className="space-y-5">
            {/* 1. STAR RATING PICKER */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Your Overall Rating *
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-[#0F0F0F] px-4 py-2.5 rounded-2xl border border-white/10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-[#D4AF37] hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Icon
                        icon="solar:star-bold"
                        className={`size-7 ${
                          star <= (hoverRating || rating)
                            ? "text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                            : "text-gray-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-[#FFE58F] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1.5 rounded-xl">
                  {RATING_LABELS[hoverRating || rating]}
                </span>
              </div>
            </div>

            {/* 2. PHOTO REVIEW UPLOAD SECTION */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                <span>Add Delivery / Unboxing Photos (Optional - Max 4)</span>
                <span className="text-[11px] text-[#D4AF37] font-normal">{reviewPhotos.length}/4 photos attached</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  placeholder="Paste direct photo image URL (e.g. https://...)"
                  className="flex-1 bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  disabled={!photoUrlInput.trim() || reviewPhotos.length >= 4}
                  className="bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon icon="solar:camera-add-bold" className="size-4 text-[#D4AF37]" />
                  Attach Photo
                </button>
              </div>

              {/* Photo Thumbnails Preview */}
              {reviewPhotos.length > 0 && (
                <div className="flex items-center gap-3 pt-2 flex-wrap">
                  {reviewPhotos.map((img, idx) => (
                    <div key={idx} className="relative size-20 rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-[#1A1A1A] group">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 size-6 bg-red-600/90 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 shadow-md cursor-pointer"
                        title="Remove photo"
                      >
                        <Icon icon="solar:close-bold" className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. REVIEW TEXT */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Detailed Collector Feedback *
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Describe your thoughts on authenticity, frame quality, color vibrancy, or delivery speed..."
                rows={3}
                required
                className="w-full bg-[#0F0F0F] border border-white/10 hover:border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-2xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none transition-all resize-none shadow-inner"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                isLoading={submittingReview}
                className="bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide px-8 py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,55,0.2)] text-xs flex items-center gap-2 cursor-pointer"
              >
                <Icon icon="solar:verified-check-bold" className="size-4" />
                Publish Verified Review
              </Button>
            </div>
          </form>
        </div>
      ) : user ? (
        /* Notice for Signed In Users who haven't purchased yet */
        <div className="p-5 bg-gradient-to-r from-[#1E1911] to-[#14120C] border border-[#D4AF37]/30 rounded-3xl flex items-center gap-4 shadow-lg">
          <div className="size-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center shrink-0">
            <Icon icon="solar:lock-keyhole-minimalistic-bold" className="size-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white">Verified Buyer Reviews Only</h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Only verified buyers who have purchased this artwork can leave star ratings and upload delivery photos.
            </p>
          </div>
        </div>
      ) : (
        /* Notice for Logged-out visitors */
        <div className="p-5 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
              <Icon icon="solar:user-bold" className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Sign In to Rate & Review</h4>
              <p className="text-[11px] text-gray-400">Join the discussion as a collector.</p>
            </div>
          </div>
          <Link
            href={`/auth/signin?redirect=/shop/${id}`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-extrabold text-xs shadow-md"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* --- REVIEWS LIST --- */}
      <div className="space-y-4 pt-2">
        <h3 className="text-base font-bold text-white tracking-wide flex items-center justify-between border-b border-white/5 pb-3">
          <span>Customer Reviews ({comments.length})</span>
        </h3>

        {commentsLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-gray-500 text-xs">
            <Icon icon="eos-icons:loading" className="size-6 animate-spin text-[#D4AF37]" />
            <span>Loading verified reviews...</span>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((c) => {
              const isEditing = editingCommentId === c._id;
              const isOwner = user && (c.userId === user.id || c.userEmail === user.email);
              const reviewRating = Number(c.rating) || 5;
              const images = Array.isArray(c.reviewImages) ? c.reviewImages : c.reviewImage ? [c.reviewImage] : [];

              return (
                <div
                  key={c._id}
                  className="bg-[#121212] border border-white/5 hover:border-white/15 rounded-3xl p-5 sm:p-6 transition-all duration-300 space-y-4 shadow-md group"
                >
                  {/* Review Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative size-11 rounded-2xl border border-white/10 overflow-hidden bg-[#1A1A1A] shrink-0">
                        {c.userImage ? (
                          <img src={c.userImage} alt={c.userName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#D4AF37] text-sm font-bold bg-[#1a1b16]">
                            {c.userName ? c.userName.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">{c.userName}</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <Icon icon="solar:shield-check-bold" className="size-3" />
                            Verified Buyer
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          {/* Stars */}
                          <div className="flex items-center text-[#D4AF37]">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Icon
                                key={star}
                                icon="solar:star-bold"
                                className={`size-3.5 ${star <= reviewRating ? "text-[#D4AF37]" : "text-gray-700"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-white">{reviewRating}.0</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-[11px] text-gray-500">
                            {new Date(c.createdAt || Date.now()).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Owner controls */}
                    {isOwner && !isEditing && (
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(c)}
                          className="p-1.5 hover:bg-[#D4AF37]/10 text-gray-400 hover:text-[#D4AF37] rounded-xl transition-all border border-white/5 hover:border-[#D4AF37]/30 cursor-pointer"
                          title="Edit Review"
                        >
                          <Icon icon="solar:pen-linear" className="size-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModalId(c._id)}
                          className="p-1.5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-white/5 hover:border-red-500/30 cursor-pointer"
                          title="Delete Review"
                        >
                          <Icon icon="solar:trash-bin-trash-linear" className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Review Content & Photos */}
                  {isEditing ? (
                    <div className="space-y-4 pt-2 border-t border-white/5">
                      {/* Rating edit */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-bold">Edit Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditingRating(star)}
                              className="text-[#D4AF37] cursor-pointer"
                            >
                              <Icon
                                icon="solar:star-bold"
                                className={`size-5 ${star <= editingRating ? "text-[#D4AF37]" : "text-gray-700"}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text edit */}
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={3}
                        className="w-full bg-[#0F0F0F] border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl p-3 text-xs text-white focus:outline-none transition-all resize-none"
                      />

                      {/* Photo edit */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={editPhotoInput}
                            onChange={(e) => setEditPhotoInput(e.target.value)}
                            placeholder="Add another delivery photo URL..."
                            className="flex-1 bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={handleAddEditPhoto}
                            className="bg-white/10 hover:bg-white/15 text-white text-xs px-3 py-2 rounded-lg"
                          >
                            Add
                          </button>
                        </div>
                        {editingPhotos.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {editingPhotos.map((img, idx) => (
                              <div key={idx} className="relative size-14 rounded-xl overflow-hidden border border-white/20">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEditPhoto(idx)}
                                  className="absolute top-0.5 right-0.5 size-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 justify-end pt-2">
                        <Button
                          size="sm"
                          variant="light"
                          onClick={handleCancelEdit}
                          className="text-gray-400 hover:text-white text-xs rounded-xl"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(c._id)}
                          className="bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-extrabold text-xs rounded-xl px-4"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans whitespace-pre-line">
                        {c.comment}
                      </p>

                      {/* Photo gallery thumbnails */}
                      {images.length > 0 && (
                        <div className="flex items-center gap-3 pt-2 flex-wrap">
                          {images.map((photo, pIdx) => (
                            <div
                              key={pIdx}
                              onClick={() => setActiveLightboxImg(photo)}
                              className="relative size-24 rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/10 hover:border-[#D4AF37] transition-all cursor-pointer group/photo shadow-md"
                            >
                              <img src={photo} alt={`Delivery photo ${pIdx + 1}`} className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                                <Icon icon="solar:magnifer-zoom-in-bold" className="size-5 text-[#D4AF37]" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#121212] border border-dashed border-white/10 rounded-3xl space-y-2">
            <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-gray-600">
              <Icon icon="solar:stars-minimalistic-linear" className="size-7 text-[#D4AF37]/50" />
            </div>
            <h4 className="text-sm font-bold text-white">No Reviews Yet</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Be the first verified collector to acquire this piece and share your star rating & doorstep photos!
            </p>
          </div>
        )}
      </div>

      {/* --- PHOTO REVIEW LIGHTBOX MODAL --- */}
      {activeLightboxImg && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-[#121212] rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveLightboxImg(null)}
              className="absolute top-4 right-4 z-10 size-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
            >
              <Icon icon="solar:close-circle-bold" className="size-6" />
            </button>
            <img src={activeLightboxImg} alt="Enlarged collector review" className="max-w-full max-h-[85vh] rounded-2xl object-contain mx-auto" />
            <div className="p-3 text-center text-xs text-gray-400 font-semibold">
              Verified Collector Delivery Photo • ArtHall Gallery
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE REVIEW CONFIRMATION MODAL --- */}
      {deleteModalId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#1C1414] to-[#121212] rounded-3xl shadow-2xl border border-red-500/30 overflow-hidden p-6 text-center space-y-5">
            <div className="size-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.15)]">
              <Icon icon="solar:trash-bin-trash-bold-duotone" className="size-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight">Delete Your Review?</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                Are you sure you want to permanently remove this star rating and review?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalId(null)}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs border border-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                isLoading={isDeleting}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                Delete Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}