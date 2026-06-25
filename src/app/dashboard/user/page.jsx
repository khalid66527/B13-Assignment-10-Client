"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Icon } from "@iconify/react";
import { getBuynowByBuynower } from "@/lib/api/buynow";

const BuyerDashboardHomePage = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [boughtArts, setBoughtArts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getBuynowByBuynower(user.id)
        .then((data) => {
          setBoughtArts(data || []);
        })
        .catch((err) => {
          console.error("Failed to load user purchases:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user?.id]);

  // Calculate dynamic stats
  const totalPurchases = boughtArts.length;
  const totalSpent = boughtArts.reduce((acc, curr) => acc + Number(curr.price || 0), 0);

  const stats = [
    {
      title: "Total Purchased",
      value: `${totalPurchases} Artwork${totalPurchases !== 1 ? "s" : ""}`,
      icon: "solar:bag-bold-duotone",
      color: "from-blue-500/20 to-indigo-500/10",
      textColor: "text-blue-400",
    },
    {
      title: "Saved Items",
      value: "12 Masterpieces",
      icon: "solar:heart-bold-duotone",
      color: "from-[#D4AF37]/20 to-[#AA7C11]/10",
      textColor: "text-[#D4AF37]",
    },
    {
      title: "Active Bids",
      value: "2 Auctions",
      icon: "solar:star-bold-duotone",
      color: "from-amber-500/20 to-orange-500/10",
      textColor: "text-amber-400",
    },
    {
      title: "Total Investment",
      value: `$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: "solar:wad-of-money-bold-duotone",
      color: "from-emerald-500/20 to-teal-500/10",
      textColor: "text-emerald-400",
    },
  ];

  // Get recent 3 purchases from backend (sorted newest first)
  const recentPurchases = [...boughtArts]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#161616] via-[#1f2019] to-[#161616] border border-[#D4AF37]/20 p-8 md:p-10 shadow-xl">
        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
            Art Collector
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-white">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]">
              {user?.name || "Collector"}
            </span>
            !
          </h2>
          <p className="text-sm text-gray-400 max-w-xl">
            Explore exclusive visual designs, purchase rare masterworks, participate in active bidding pools, and build your digital fine art archive.
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
        {/* Recent Purchases List (Left Col) */}
        <div className="lg:col-span-2 bg-[#161616]/70 border border-[#D4AF37]/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-white">Recent Purchases</h3>
              <p className="text-xs text-gray-400">Track and view your acquired artworks</p>
            </div>
            <Link
              href="/dashboard/user/bought-arts"
              className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              See All <Icon icon="solar:arrow-right-linear" />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Icon icon="eos-icons:loading" className="text-2xl text-[#D4AF37] animate-spin" />
              </div>
            ) : recentPurchases.length > 0 ? (
              recentPurchases.map((purchase) => (
                <div
                  key={purchase._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#1c1d17]/50 border border-[#D4AF37]/5 hover:border-[#D4AF37]/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 border border-[#D4AF37]/10 shrink-0">
                      <img
                        src={purchase.image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=150"}
                        alt={purchase.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {purchase.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {purchase.category} •{" "}
                        {purchase.createdAt
                          ? new Date(purchase.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-semibold text-[#D4AF37]">
                      ${Number(purchase.price || 0).toLocaleString()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                      Paid
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 border border-dashed border-[#D4AF37]/10 rounded-xl bg-[#121212]/30">
                <Icon icon="solar:gallery-wide-linear" className="text-xl text-gray-600 mb-2 mx-auto" />
                <p className="text-xs text-gray-500">No purchases found in your collection.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel (Right Col) */}
        <div className="bg-[#161616]/70 border border-[#D4AF37]/10 rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-white">Quick Actions</h3>
            <p className="text-xs text-gray-400">Quickly access common buyer tasks</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/collections"
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#AA7C11]/20 to-[#D4AF37]/10 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center shrink-0">
                <Icon icon="solar:gallery-linear" className="text-xl" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  Explore Collections
                </h4>
                <p className="text-[11px] text-gray-400">Discover handpicked creations</p>
              </div>
            </Link>

            <Link
              href="/dashboard/user/bought-arts"
              className="flex items-center gap-3 p-4 rounded-xl bg-[#1c1d17]/50 border border-[#D4AF37]/5 hover:border-[#D4AF37]/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-800 text-[#D4AF37] border border-[#D4AF37]/25 flex items-center justify-center shrink-0">
                <Icon icon="solar:bag-linear" className="text-xl" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  My Bought Artworks
                </h4>
                <p className="text-[11px] text-gray-400">View your entire collection</p>
              </div>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-3 p-4 rounded-xl bg-[#1c1d17]/50 border border-[#D4AF37]/5 hover:border-[#D4AF37]/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-800 text-[#D4AF37] border border-[#D4AF37]/25 flex items-center justify-center shrink-0">
                <Icon icon="solar:user-linear" className="text-xl" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                  Collector Profile
                </h4>
                <p className="text-[11px] text-gray-400">Manage account information</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardHomePage;