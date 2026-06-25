"use client";

import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

const categories = [
  {
    name: "Painting",
    icon: "solar:palette-round-bold-duotone",
    desc: "Exquisite oil, acrylic, and watercolor works on canvas.",
    color: "from-blue-500/20 to-indigo-500/10",
    textColor: "text-blue-400",
    glow: "shadow-blue-500/10",
  },
  {
    name: "Digital Art",
    icon: "solar:monitor-smartphone-bold-duotone",
    desc: "Modern digital paint, cyberpunk concepts, and vector masterworks.",
    color: "from-purple-500/20 to-pink-500/10",
    textColor: "text-purple-400",
    glow: "shadow-purple-500/10",
  },
  {
    name: "Sculpture",
    icon: "solar:magic-stick-bold-duotone",
    desc: "Physical 3D creations, marble carvings, and custom metal structures.",
    color: "from-[#D4AF37]/20 to-[#AA7C11]/10",
    textColor: "text-[#D4AF37]",
    glow: "shadow-[#D4AF37]/10",
  },
  {
    name: "Photography",
    icon: "solar:camera-minimalistic-bold-duotone",
    desc: "Breathtaking landscapes, urban nights, and raw human expressions.",
    color: "from-emerald-500/20 to-teal-500/10",
    textColor: "text-emerald-400",
    glow: "shadow-emerald-500/10",
  },
];

const ArtCatagory = () => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-12 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/2 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header section */}
        <div className="text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/20 rounded-full px-3 py-1 bg-[#D4AF37]/5">
            Mediums
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-white tracking-tight">
            Browse By <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]">Category</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Discover breathtaking masterpieces sorted by medium. Click on any category to explore our curated shop collection.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {categories.map((cat, index) => (
            <Link
              key={index}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className={`group relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-[#161616]/40 p-6 flex flex-col justify-between h-[250px] transition-all duration-300 hover:border-[#D4AF37]/45 hover:-translate-y-1 hover:shadow-2xl ${cat.glow}`}
            >
              {/* Top hover indicator */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Icon & Details */}
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center border border-white/5 transition-transform duration-500 group-hover:rotate-6`}>
                  <Icon icon={cat.icon} className={`text-2xl ${cat.textColor}`} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-serif font-extrabold text-white group-hover:text-[#FFE58F] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans line-clamp-3">
                    {cat.desc}
                  </p>
                </div>
              </div>

              {/* Action indicator at bottom */}
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 group-hover:text-[#D4AF37] transition-colors pt-4 border-t border-white/[0.03]">
                <span>Explore Pieces</span>
                <Icon
                  icon="solar:arrow-right-linear"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtCatagory;