"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";

const ArtistDashboardHomePage = () => {
  const { data: session } = useSession();
  const user = session?.user;

  // Mock stats
  const stats = [
    {
      title: "Total Artworks",
      value: "14",
      icon: "solar:gallery-bold-duotone",
      color: "from-blue-500/20 to-indigo-500/10",
      textColor: "text-blue-400",
    },
    {
      title: "Sold Artworks",
      value: "5",
      icon: "solar:cart-large-minimalistic-bold-duotone",
      color: "from-[#D4AF37]/20 to-[#AA7C11]/10",
      textColor: "text-[#D4AF37]",
    },
    {
      title: "Pending Approval",
      value: "2",
      icon: "solar:clock-circle-bold-duotone",
      color: "from-amber-500/20 to-orange-500/10",
      textColor: "text-amber-400",
    },
    {
      title: "Total Earnings",
      value: "$1,820.00",
      icon: "solar:wad-of-money-bold-duotone",
      color: "from-emerald-500/20 to-teal-500/10",
      textColor: "text-emerald-400",
    },
  ];

  // Mock recent artworks
  const recentArts = [
    {
      id: 1,
      title: "Golden Hour Symphony",
      price: "$450.00",
      category: "Oil Painting",
      status: "Approved",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Ethereal Whispers",
      price: "$320.00",
      category: "Acrylic",
      status: "Pending",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Shadows of Truth",
      price: "$600.00",
      category: "Digital Art",
      status: "Approved",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#161616] via-[#1f2019] to-[#161616] border border-[#D4AF37]/20 p-8 md:p-10 shadow-xl">
        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
            Creator Dashboard
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-white">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]">
              {user?.name || "Artist"}
            </span>
            !
          </h2>
          <p className="text-sm text-gray-400 max-w-xl">
            Manage your digital gallery, add new premium artworks, track sales, and connect with global collectors directly from your dashboard panel.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-gradient-to-b from-[#161616]/90 to-[#0F0F0F]/95 border border-[#D4AF37]/15 rounded-2xl p-6 shadow-md hover:border-[#D4AF37]/45 transition-all duration-300 group flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {stat.value}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center border border-[#D4AF37]/10 group-hover:scale-105 transition-transform duration-300`}>
              <Icon icon={stat.icon} className={`text-2xl ${stat.textColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Layout - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Artworks List (Left Col) */}
        <div className="lg:col-span-2 bg-[#161616]/70 border border-[#D4AF37]/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-white">Recent Artworks</h3>
              <p className="text-xs text-gray-400">View and update your latest listings</p>
            </div>
            <Link
              href="/dashboard/artist/allarts"
              className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              See All <Icon icon="solar:arrow-right-linear" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentArts.map((art) => (
              <div
                key={art.id}
                className="flex items-center justify-between p-4 rounded-xl bg-[#1c1d17]/50 border border-[#D4AF37]/5 hover:border-[#D4AF37]/20 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 border border-[#D4AF37]/10">
                    <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{art.title}</h4>
                    <p className="text-xs text-gray-400">{art.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-semibold text-[#D4AF37]">{art.price}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      art.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {art.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel (Right Col) */}
        <div className="bg-[#161616]/70 border border-[#D4AF37]/10 rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-white">Quick Actions</h3>
            <p className="text-xs text-gray-400">Jump straight into creator tasks</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard/artist/allarts/newArt"
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#AA7C11]/20 to-[#D4AF37]/10 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center shrink-0">
                <Icon icon="solar:add-circle-linear" className="text-xl" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  Post A New Art
                </h4>
                <p className="text-[11px] text-gray-400">List a new creation for sale</p>
              </div>
            </Link>

            <Link
              href="/dashboard/artist/allarts"
              className="flex items-center gap-3 p-4 rounded-xl bg-[#1c1d17]/50 border border-[#D4AF37]/5 hover:border-[#D4AF37]/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-800 text-[#D4AF37] border border-[#D4AF37]/25 flex items-center justify-center shrink-0">
                <Icon icon="solar:gallery-linear" className="text-xl" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  Manage Gallery
                </h4>
                <p className="text-[11px] text-gray-400">Edit, update, and search your art</p>
              </div>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-3 p-4 rounded-xl bg-[#1c1d17]/50 border border-[#D4AF37]/5 hover:border-[#D4AF37]/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center shrink-0">
                <Icon icon="solar:user-circle-linear" className="text-xl" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  Update Profile
                </h4>
                <p className="text-[11px] text-gray-400">Change bio, photo, and links</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboardHomePage;