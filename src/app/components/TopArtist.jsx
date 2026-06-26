"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Avatar } from "@heroui/react";

const TopArtist = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/top-artists`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setArtists(data);
      } catch (err) {
        console.error("Error fetching top artists:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTopArtists();
  }, []);

  const rankThemes = [
    {
      badge: "👑 Champion",
      color: "from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]",
      shadow: "shadow-[#D4AF37]/10 border-[#D4AF37]/40",
      bg: "bg-[#D4AF37]/5",
      rankIcon: "solar:crown-minimalistic-bold-duotone",
      rankTextColor: "text-[#FFE58F]",
    },
    {
      badge: "🥈 Silver Tier",
      color: "from-gray-350 via-gray-400 to-gray-500",
      shadow: "shadow-gray-400/10 border-gray-500/30",
      bg: "bg-gray-400/5",
      rankIcon: "solar:star-bold-duotone",
      rankTextColor: "text-gray-350",
    },
    {
      badge: "🥉 Bronze Tier",
      color: "from-amber-600 via-amber-700 to-amber-800",
      shadow: "shadow-amber-700/10 border-amber-800/30",
      bg: "bg-amber-800/5",
      rankIcon: "solar:medal-bold-duotone",
      rankTextColor: "text-amber-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-[#D4AF37]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]"></div>
      </div>
        <p className="text-xs text-gray-500 font-medium">Curating our top selling creators...</p>
      </div>
    );
  }

  if (error || artists.length === 0) {
    return (
      <div className="text-center py-16 bg-[#161616]/40 border border-white/5 rounded-3xl">
        <Icon icon="solar:users-group-two-rounded-linear" className="size-10 mx-auto text-gray-600 mb-3" />
        <h3 className="text-sm font-semibold text-white">No Top Artists Found</h3>
        <p className="text-xs text-gray-500 mt-1">Try again later or verify your database.</p>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-12 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#D4AF37]/3 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header section */}
        <div className="text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/20 rounded-full px-3 py-1 bg-[#D4AF37]/5">
            Hall of Fame
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-white tracking-tight">
            Top Selling <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]">Artists</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Meet our master creators whose exquisite pieces are highly sought-after and acquired most frequently by collectors worldwide.
          </p>
        </div>

        {/* 🏆 Artist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {artists.map((artist, index) => {
            const theme = rankThemes[index] || rankThemes[2];
            return (
              <div
                key={artist._id || index}
                className={`group relative overflow-hidden rounded-[2rem] border p-6 bg-gradient-to-b from-[#161616] to-[#0F0F0F] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${theme.shadow} flex flex-col justify-between h-[360px]`}
              >
                {/* Top decorative gradient line on hover */}
                <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${theme.color} opacity-80 transition-all duration-500`}></div>

                {/* Card Header: Rank Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/5 bg-white/5 ${theme.rankTextColor}`}>
                    {theme.badge}
                  </span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme.bg} border border-[#D4AF37]/10`}>
                    <Icon icon={theme.rankIcon} className={`text-lg ${theme.rankTextColor}`} />
                  </div>
                </div>

                {/* Card Center: Avatar & Info */}
                <div className="flex flex-col items-center text-center space-y-4 my-auto">
                  <div className="relative">
                    {/* Ring glow wrapper */}
                    <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${theme.color} opacity-40 blur-sm group-hover:opacity-75 transition-opacity`}></div>
                    <Avatar
                      className="w-20 h-20 rounded-full border-2 border-zinc-950 relative z-10 shrink-0"
                    >
                      <Avatar.Image src={artist.image} />
                      <Avatar.Fallback>
                        <Icon icon="solar:user-bold" className="size-8 text-gray-500" />
                      </Avatar.Fallback>
                    </Avatar>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-serif font-extrabold text-white group-hover:text-[#FFE58F] transition-colors">
                      {artist.name || "N/A"}
                    </h3>
                    <p className="text-xs text-[#D4AF37] font-semibold tracking-wide bg-[#D4AF37]/5 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/10">
                      Professional Artist
                    </p>
                  </div>
                </div>

                {/* Card Footer: Sales Count Indicator */}
                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Total Sold</span>
                    <span className="text-lg font-black text-white">{artist.salesCount} masterpieces</span>
                  </div>
                  <div className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase bg-gradient-to-r ${theme.color} text-black`}>
                    Top Creator
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopArtist;