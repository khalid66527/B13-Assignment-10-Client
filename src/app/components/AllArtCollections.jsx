"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getCompanyArts } from "@/lib/api/arts";

// Default fallback mock artworks if the database is empty
const defaultArtworks = [
  {
    _id: "art-1",
    title: "Golden Hour Symphony",
    category: "Oil Painting",
    companyName: "Aria Vance",
    price: "450",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop",
  },
  {
    _id: "art-2",
    title: "Ethereal Whispers",
    category: "Acrylic",
    companyName: "Elena Rostova",
    price: "320",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop",
  },
  {
    _id: "art-3",
    title: "Shadows of Truth",
    category: "Digital Art",
    companyName: "Marcus Chen",
    price: "600",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
  },
  {
    _id: "art-4",
    title: "Cosmic Reverie",
    category: "Digital Art",
    companyName: "Kenji Sato",
    price: "850",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
  },
];

// Helper Component for Scroll-animated Card
const ScrollRevealCard = ({ children, delayIndex }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[900ms] cubic-bezier(0.16, 1, 0.3, 1)`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(60px)",
        transitionDelay: `${delayIndex * 60}ms`,
      }}
    >
      {children}
    </div>
  );
};

const AllArtCollections = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Oil Painting", "Acrylic", "Digital Art", "Photography", "Sculpture"];

  useEffect(() => {
    getCompanyArts()
      .then((data) => {
        if (data && data.length > 0) {
          // Filter to show only approved artworks if there's a status field
          setArtworks(data);
        } else {
          setArtworks(defaultArtworks);
        }
      })
      .catch((err) => {
        console.error("Failed to load artworks from backend:", err);
        setArtworks(defaultArtworks);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredArtworks = artworks.filter((art) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (art.category || "").toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      (art.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.companyName || art.artistName || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300 py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Banner Section */}
        <div className="text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/20 rounded-full px-3 py-1 bg-[#D4AF37]/5">
            Curated Showcase
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-white tracking-tight">
            Explore All <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]">Collections</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Browse through unique premium works of fine art, photography, sculptures, and modern digital compositions curated globally.
          </p>
        </div>

        {/* Filter and Search Bar Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#161616]/50 border border-zinc-800/80 p-5 rounded-2xl">
          {/* Categories Slider */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/10"
                    : "bg-[#161616] text-gray-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80 shrink-0">
            <Icon
              icon="solar:magnifer-linear"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base"
            />
            <input
              type="text"
              placeholder="Search artworks or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#161616]/95 border border-zinc-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all duration-300"
            />
          </div>
        </div>

        {/* Art Gallery Grid with Scroll Animation */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Icon icon="eos-icons:loading" className="text-4xl text-[#D4AF37] animate-spin" />
            <p className="text-xs text-gray-500">Loading curations...</p>
          </div>
        ) : filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredArtworks.map((art, index) => {
              const artId = art._id || art.id;
              return (
                <ScrollRevealCard key={artId} delayIndex={index % 4}>
                  <div className="group bg-[#161616]/90 border border-zinc-800/80 hover:border-[#D4AF37]/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg h-full flex flex-col justify-between">
                    {/* Artwork Image & Hover State */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                      <img
                        src={art.image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop"}
                        alt={art.title || "Artwork"}
                        className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-110"
                        loading="lazy"
                      />

                      {/* Price and Category Tags */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-black/60 backdrop-blur-md border border-zinc-800 text-gray-300">
                          {art.category || "Fine Art"}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#D4AF37] text-black">
                          ${Number(art.price || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 z-20">
                        <p className="text-white font-serif text-sm font-bold text-center mb-1 line-clamp-2 px-2">
                          {art.title || "Untitled"}
                        </p>
                        <p className="text-[#D4AF37] text-[10px] uppercase tracking-wider font-semibold mb-4">
                          by {art.companyName || art.artistName || "Verified Artist"}
                        </p>
                        <Link
                          href={`/shop/${artId}`}
                          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-[11px] font-bold shadow-md hover:brightness-110 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                        >
                          Acquire Artwork
                          <Icon icon="solar:arrow-right-linear" className="text-xs" />
                        </Link>
                      </div>
                    </div>

                    {/* Artwork Info Footer */}
                    <div className="p-4 space-y-1 bg-[#121212]/30 border-t border-zinc-900/50">
                      <h3 className="text-sm font-serif font-bold text-white truncate group-hover:text-[#D4AF37] transition-colors duration-200">
                        {art.title || "Untitled Masterpiece"}
                      </h3>
                      <p className="text-[11px] text-gray-500">by {art.companyName || art.artistName || "Verified Artist"}</p>
                    </div>
                  </div>
                </ScrollRevealCard>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-800 rounded-3xl bg-[#161616]/30 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gray-600">
              <Icon icon="solar:gallery-wide-linear" className="text-2xl" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-white">No Artworks Found</h3>
              <p className="text-xs text-gray-500 max-w-xs">
                We couldn't find any artworks matching your search or category selection. Try resetting filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-[#D4AF37] text-black text-xs font-bold rounded-xl shadow-md hover:brightness-105 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllArtCollections;