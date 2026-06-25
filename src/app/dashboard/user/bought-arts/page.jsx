"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Icon } from "@iconify/react";
import { getBuynowByBuynower } from "@/lib/api/buynow";

const BoughtArtsPage = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [boughtArts, setBoughtArts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getBuynowByBuynower(user.id)
        .then((data) => {
          setBoughtArts(data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch user bought artworks:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user?.id]);

  const filteredArts = boughtArts.filter(
    (art) =>
      (art.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.companyName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4AF37]/10 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
            My Gallery
          </span>
          <h1 className="text-3xl font-serif font-extrabold text-white mt-1">
            Bought Artworks
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            A premium showcase of your purchased masterpieces and digital acquisitions.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Icon
            icon="solar:magnifer-linear"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
          />
          <input
            type="text"
            placeholder="Search by title, category, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#161616]/95 border border-[#D4AF37]/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/60 transition-all duration-300"
          />
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Icon icon="eos-icons:loading" className="text-4xl text-[#D4AF37] animate-spin" />
          <p className="text-xs text-gray-500">Loading your fine art collection...</p>
        </div>
      ) : filteredArts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArts.map((art) => (
            <div
              key={art._id}
              className="group bg-[#161616]/90 border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg flex flex-col justify-between"
            >
              {/* Image & Hover Action Overlay */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                <img
                  src={art.image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop"}
                  alt={art.title || "Artwork"}
                  className="w-full h-full object-cover transition-transform duration-770 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-black/70 backdrop-blur-md border border-[#D4AF37]/20 text-[#D4AF37]">
                    {art.category || "Fine Art"}
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#D4AF37] text-black">
                    ${Number(art.price || 0).toLocaleString()}
                  </span>
                </div>

                {/* Hover Glassmorphic Overlay */}
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 z-20">
                  <p className="text-[#D4AF37] font-serif text-sm font-bold uppercase tracking-wider mb-1">
                    Acquisition Confirmed
                  </p>
                  <p className="text-gray-400 text-[10px] mb-4">
                    Art ID: {art.id || art._id}
                  </p>

                  <Link
                    href={`/shop/${art.id || art._id}`}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-[11px] font-bold shadow-md hover:brightness-110 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                  >
                    View Details
                    <Icon icon="solar:arrow-right-linear" className="text-xs" />
                  </Link>
                </div>
              </div>

              {/* Artwork Info Footer */}
              <div className="p-5 space-y-2 border-t border-[#D4AF37]/5 bg-[#121212]/30">
                <div>
                  <h3 className="text-base font-serif font-bold text-white leading-snug group-hover:text-[#D4AF37] transition-colors duration-200 truncate">
                    {art.title || "Untitled Masterpiece"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">by {art.companyName || "Verified Creator"}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#D4AF37]/5 text-[10px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <Icon icon="solar:calendar-linear" className="text-xs text-[#D4AF37]" />
                    <span>
                      {art.createdAt
                        ? new Date(art.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Owned"}
                    </span>
                  </div>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">
                    Owned
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#D4AF37]/15 rounded-3xl bg-[#161616]/40 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
            <Icon icon="solar:gallery-linear" className="text-3xl" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-white">No Artworks Found</h3>
            <p className="text-xs text-gray-500 max-w-xs">
              No purchased items match your search. Explore our collections to acquire a new masterpiece!
            </p>
          </div>
          <Link
            href="/collections"
            className="px-5 py-2 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-xs font-bold rounded-xl shadow-lg hover:brightness-110 transition-all duration-300"
          >
            Explore Gallery
          </Link>
        </div>
      )}
    </div>
  );
};

export default BoughtArtsPage;