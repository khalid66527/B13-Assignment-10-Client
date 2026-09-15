"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getCompanyArts } from "@/lib/api/arts";
import { useCart } from "@/lib/context/CartContext";

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
  const { addToCart } = useCart();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompanyArts()
      .then((data) => {
        if (data && data.length > 0) {
          setArtworks(data);
        } else {
          setArtworks(defaultArtworks);
        }
      })
      .catch((err) => {
        console.error("Error fetching arts:", err);
        setArtworks(defaultArtworks);
      })
      .finally(() => setLoading(false));
  }, []);

  // Display only first 8 items for a clean grid layout
  const displayedArtworks = artworks.slice(0, 8);

  return (
    <section className="py-24 bg-[#0A0A0A] text-white relative overflow-hidden border-t border-zinc-900">
      {/* Decorative Gold Radial Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#FFE58F] text-[10px] uppercase tracking-widest font-bold">
              <Icon icon="solar:stars-minimalistic-bold" className="text-xs" />
              Curated Masterpieces
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif font-extrabold tracking-tight text-white">
              Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]">Collections</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
              Explore handpicked, verified artworks from the world&apos;s most gifted artists.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:text-[#FFE58F] transition-colors group self-start md:self-auto border-b border-[#D4AF37]/30 pb-1"
          >
            View Entire Gallery
            <Icon icon="solar:arrow-right-linear" className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Art Gallery Grid with Scroll Animation */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Icon icon="eos-icons:loading" className="text-4xl text-[#D4AF37] animate-spin" />
            <p className="text-xs text-gray-500">Loading curations...</p>
          </div>
        ) : displayedArtworks.length > 0 ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayedArtworks.map((art, index) => {
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
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 z-20 gap-2">
                          <p className="text-white font-serif text-sm font-bold text-center mb-0.5 line-clamp-2 px-2">
                            {art.title || "Untitled"}
                          </p>
                          <p className="text-[#D4AF37] text-[10px] uppercase tracking-wider font-semibold mb-2">
                            by {art.companyName || art.artistName || "Verified Artist"}
                          </p>
                          <div className="flex flex-col gap-2 w-full max-w-[170px]">
                            <Link
                              href={`/shop/${artId}`}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-[11px] font-bold shadow-md hover:brightness-110 transition-all text-center"
                            >
                              <Icon icon="solar:eye-bold" className="text-xs" />
                              View Art
                            </Link>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(art);
                              }}
                              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-[#D4AF37]/30 text-white text-[11px] font-bold transition-all cursor-pointer"
                            >
                              <Icon icon="solar:cart-plus-bold" className="text-xs text-[#D4AF37]" />
                              Add to Cart
                            </button>
                          </div>
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

            {artworks.length > 8 && (
              <div className="flex justify-center pt-4 animate-fadeUp">
                <Link
                  href="/shop"
                  className="px-8 py-3.5 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide rounded-xl shadow-[0_4px_20px_rgba(212,175,55,0.2)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-xs group"
                >
                  <span>See More Artworks</span>
                  <Icon
                    icon="solar:arrow-right-linear"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-800 rounded-3xl bg-[#161616]/30 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gray-600">
              <Icon icon="solar:gallery-wide-linear" className="text-2xl" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-white">No Artworks Found</h3>
              <p className="text-xs text-gray-500 max-w-xs">
                We couldnt find any artworks in the curated collection. Check back later!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
    
export default AllArtCollections;