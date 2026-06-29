"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import Link from "next/link";

const CommentPage = ({ artworkId, user }) => {
  const id = artworkId;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isPurchased, setIsPurchased] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";

  // Fetch comments and check purchase status
  useEffect(() => {
    const loadComments = async () => {
      if (!id) return;
      try {
        const res = await fetch(`${baseUrl}/api/artworks/${id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (err) {
        console.error("Error loading comments:", err);
      } finally {
        setCommentsLoading(false);
      }
    };

    const checkPurchase = async () => {
      if (!id || !user?.id) return;
      try {
        const res = await fetch(`${baseUrl}/api/artworks/${id}/purchased-check?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setIsPurchased(data.purchased);
        }
      } catch (err) {
        console.error("Error checking purchase status:", err);
      }
    };

    loadComments();
    checkPurchase();
  }, [id, user, baseUrl]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      const token = localStorage.getItem("jwt_token");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`${baseUrl}/api/artworks/${id}/comments`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          userImage: user.image,
          comment: newComment.trim(),
        }),
      });

      if (res.ok) {
        const updatedRes = await fetch(`${baseUrl}/api/artworks/${id}/comments`);
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          setComments(updatedData);
        }
        setNewComment("");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to post comment.");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Error posting comment.");
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.comment);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (commentId) => {
    if (!editingText.trim() || !user) return;

    try {
      const token = localStorage.getItem("jwt_token");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`${baseUrl}/api/comments/${commentId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          userId: user.id,
          comment: editingText.trim(),
        }),
      });

      if (res.ok) {
        setComments(prev =>
          prev.map(c => c._id === commentId ? { ...c, comment: editingText.trim(), updatedAt: new Date() } : c)
        );
        setEditingCommentId(null);
        setEditingText("");
      } else {
        alert("Failed to save changes.");
      }
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const token = localStorage.getItem("jwt_token");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch(`${baseUrl}/api/comments/${commentId}?userId=${user.id}`, {
        method: "DELETE",
        headers
      });

      if (res.ok) {
        setComments(prev => prev.filter(c => c._id !== commentId));
      } else {
        alert("Failed to delete comment.");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="border-t border-white/5 mt-10 pt-10 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl text-[#D4AF37]">
          <Icon icon="solar:chat-line-linear" className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Collector Comments</h2>
          <p className="text-xs text-gray-500 mt-0.5">Exclusive discussions for verified buyers of this masterpiece.</p>
        </div>
      </div>

      {/* Conditional Comment Input Form */}
      {isPurchased ? (
        <form onSubmit={handleAddComment} className="space-y-3">
          <div className="flex gap-4 items-start">
            <div className="relative w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-[#1A1A1A] shrink-0">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#D4AF37] text-sm font-bold bg-[#1a1b16]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your review or comment about this artwork..."
                rows={3}
                required
                className="w-full bg-[#111] border border-white/10 hover:border-[#D4AF37]/35 focus:border-[#D4AF37] rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-all resize-none"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide px-5 py-2.5 rounded-xl transition-all shadow-md text-xs flex items-center gap-1.5"
                >
                  <Icon icon="solar:send-bold" className="size-3.5" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : user ? (
        <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-2xl flex items-start gap-3">
          <Icon icon="solar:lock-keyhole-minimalistic-bold" className="size-5 text-[#FFE58F] shrink-0 mt-0.5" />
          <p className="text-xs text-[#FFE58F]/80 leading-relaxed">
            Only collectors who have acquired this artwork can leave comments. Purchase this piece to join the discussion.
          </p>
        </div>
      ) : (
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
          <Icon icon="solar:user-bold" className="size-5 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Please <Link href={`/auth/signin?redirect=/shop/${id}`} className="text-[#D4AF37] font-bold hover:underline">Sign In</Link> to view and leave comments.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 pt-4">
        {commentsLoading ? (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Icon icon="eos-icons:loading" className="animate-spin text-[#D4AF37]" />
            <span>Loading comments...</span>
          </div>
        ) : comments.length > 0 ? (
          <div className="divide-y divide-white/5 space-y-4">
            {comments.map((c) => {
              const isEditing = editingCommentId === c._id;
              const isOwner = user && c.userId === user.id;

              return (
                <div key={c._id} className="pt-4 flex gap-4 items-start group">
                  {/* Avatar */}
                  <div className="relative w-9 h-9 rounded-full border border-white/5 overflow-hidden bg-[#1A1A1A] shrink-0">
                    {c.userImage ? (
                      <img src={c.userImage} alt={c.userName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold bg-[#1a1b16]">
                        {c.userName ? c.userName.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{c.userName}</span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>

                      {/* Action buttons (only for owner) */}
                      {isOwner && !isEditing && (
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(c)}
                            className="p-1 hover:bg-[#D4AF37]/10 text-gray-400 hover:text-[#D4AF37] rounded-lg transition-all"
                            title="Edit Comment"
                          >
                            <Icon icon="solar:pen-linear" className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(c._id)}
                            className="p-1 hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                            title="Delete Comment"
                          >
                            <Icon icon="solar:trash-bin-trash-linear" className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Edit mode vs Read mode */}
                    {isEditing ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          rows={2}
                          className="w-full bg-[#111] border border-[#D4AF37]/50 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-all resize-none"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="light"
                            onClick={handleCancelEdit}
                            className="text-gray-400 hover:text-white text-[10px] min-w-12 h-7 rounded-lg"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(c._id)}
                            className="bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-bold text-[10px] min-w-14 h-7 rounded-lg"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-300 leading-relaxed font-sans pr-4">
                        {c.comment}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-[#111111]/40 border border-dashed border-white/5 rounded-2xl">
            <Icon icon="solar:chat-square-line-linear" className="size-8 mx-auto text-gray-600 mb-2" />
            <p className="text-xs text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentPage;