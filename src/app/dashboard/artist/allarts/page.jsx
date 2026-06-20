"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCompanyArts, deleteArt } from "@/lib/api/arts";
import { getArtistCompany } from "@/lib/api/companies";
import { useSession } from "@/lib/auth-client";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";

export default function ArtistAllArts() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [arts, setArts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Delete Modal state
  const [deleteArtId, setDeleteArtId] = useState(null);
  const [deleteArtTitle, setDeleteArtTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isSessionPending && !session?.user?.id) {
      setIsLoading(false);
      return;
    }

    if (!session?.user?.id) return;

    const fetchArts = async () => {
      try {
        const companyData = await getArtistCompany(session.user.id);
        const companyObj = companyData?.[0] || {};
        const companyId = companyObj._id;

        const allArts = await getCompanyArts();
        if (companyId) {
          const filtered = (allArts || []).filter(
            (art) => art.companyId === companyId
          );
          setArts(filtered);
        } else {
          setArts([]);
        }
      } catch (error) {
        console.error("Failed to fetch arts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArts();
  }, [session, isSessionPending]);

  const openDeleteConfirm = (id, title) => {
    setDeleteArtId(id);
    setDeleteArtTitle(title);
  };

  const closeDeleteConfirm = () => {
    setDeleteArtId(null);
    setDeleteArtTitle("");
  };

  const confirmDelete = async () => {
    if (!deleteArtId) return;
    setIsDeleting(true);
    try {
      const res = await deleteArt(deleteArtId);
      if (res.deletedCount || res.acknowledged) {
        setArts((prev) => prev.filter((art) => (art._id || art.id) !== deleteArtId));
        alert("Artwork deleted successfully!");
      } else {
        alert("Failed to delete artwork.");
      }
    } catch (error) {
      console.error("Error deleting artwork:", error);
      alert("Error deleting artwork. Please try again.");
    } finally {
      setIsDeleting(false);
      closeDeleteConfirm();
    }
  };

  if (isLoading || isSessionPending) {
    return <div className="text-white text-center py-10">Loading your arts...</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-white">
            My Artworks
          </h2>
          <p className="text-sm text-gray-400">
            View, filter, edit, and manage your custom artwork collection.
          </p>
        </div>
        <Link href="/dashboard/artist/allarts/newArt">
          <Button
            radius="xl"
            className="bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-bold tracking-wide shadow-[0_4px_20px_rgba(212,175,55,0.25)] flex items-center gap-2"
          >
            <Icon icon="solar:add-circle-bold" className="text-xl" />
            Post A New Art
          </Button>
        </Link>
      </div>

      {/* Artworks List (Card Grid) */}
      {arts.length === 0 ? (
        <div className="bg-gradient-to-b from-[#161616]/90 to-[#0F0F0F]/95 border border-[#D4AF37]/15 rounded-3xl p-12 text-center space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mx-auto border border-[#D4AF37]/10">
            <Icon icon="solar:gallery-linear" className="text-[#D4AF37] text-3xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Artworks Listed</h3>
            <p className="text-sm text-gray-400 mt-1">
              Get started by uploading your first masterpiece.
            </p>
          </div>
          <Link href="/dashboard/artist/allarts/newArt" className="inline-block mt-2">
            <Button size="sm" variant="bordered" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10">
              Add New Art
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {arts.map((art) => (
            <div
              key={art._id || art.id}
              className="group bg-gradient-to-b from-[#161616]/90 to-[#0F0F0F]/95 border border-[#D4AF37]/15 rounded-3xl overflow-hidden hover:border-[#D4AF37]/45 transition-all duration-300 shadow-xl hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)] flex flex-col h-full relative"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Artwork Image Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center border-b border-[#D4AF37]/10">
                {art.image ? (
                  <img
                    src={art.image}
                    alt={art.title || "Artwork image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center text-gray-500 text-sm">
                    No Image Available
                  </div>
                )}
                {/* Price badge */}
                <div className="absolute bottom-3 right-3 bg-black/85 border border-[#D4AF37]/25 rounded-full px-3.5 py-1 text-xs font-bold text-[#D4AF37] shadow-lg">
                  ${art.price || "0.00"}
                </div>
              </div>

              {/* Card Details Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300 truncate">
                    {art.title || "Untitled"}
                  </h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-semibold text-gray-400 bg-gray-900 border border-gray-800 rounded-full px-2.5 py-0.5">
                      {art.category || "General"}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Icon icon="solar:calendar-linear" className="text-sm text-gray-550" />
                      {art.date ? new Date(art.date).toLocaleDateString() : "No Date"}
                    </span>
                  </div>
                  {art.description && (
                    <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                      {art.description}
                    </p>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 border-t border-[#D4AF37]/10 flex items-center justify-between">
                  <div className="text-[11px] text-gray-500 font-mono">
                    {art.dimensions || "Dimensions N/A"}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* View Button */}
                    <Link href={`/dashboard/artist/allarts/${art._id || art.id}`}>
                      <Button
                        isIconOnly
                        size="sm"
                        className="text-gray-400 hover:text-[#D4AF37] bg-transparent hover:bg-gray-800/80 rounded-xl"
                      >
                        <Icon className="size-4.5" icon="gravity-ui:eye" />
                      </Button>
                    </Link>

                    {/* Edit Button */}
                    <Link href={`/dashboard/artist/allarts/edit/${art._id || art.id}`}>
                      <Button
                        isIconOnly
                        size="sm"
                        className="text-gray-400 hover:text-[#D4AF37] bg-transparent hover:bg-gray-800/80 rounded-xl"
                      >
                        <Icon className="size-4.5" icon="gravity-ui:pencil" />
                      </Button>
                    </Link>

                    {/* Delete Button */}
                    <Button
                      isIconOnly
                      size="sm"
                      onClick={() => openDeleteConfirm(art._id || art.id, art.title)}
                      className="text-red-400 hover:text-white bg-transparent hover:bg-red-500/20 rounded-xl"
                    >
                      <Icon className="size-4.5" icon="gravity-ui:trash-bin" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteArtId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-[#121212] border border-red-500/30 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl space-y-6 relative overflow-hidden transform scale-100 transition-transform duration-300">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500"></div>

            <div className="flex items-center gap-3 text-red-500">
              <Icon icon="solar:danger-triangle-bold" className="text-3xl shrink-0 animate-pulse" />
              <h3 className="text-xl font-bold font-serif text-white">Delete Artwork</h3>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                Are you sure you want to permanently delete <strong className="text-[#D4AF37]">`{deleteArtTitle}`</strong>?
              </p>
              <p className="text-xs text-gray-500">
                This action is irreversible and the artwork will be permanently deleted from the collection.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                onClick={closeDeleteConfirm}
                disabled={isDeleting}
                className="bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                isLoading={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold px-5 py-2 shadow-[0_4px_15px_rgba(239,68,68,0.25)]"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}