import React from 'react';
import { Icon } from '@iconify/react';
import { getAllUsers } from '@/lib/api/alluser';
import { getCompanyArts } from '@/lib/api/arts';
import { getAllPurchases } from '@/lib/api/purchases';
import { getAllSubscriptions } from '@/lib/api/subscriptions';

const AnalyticsPage = async () => {
    let users = [];
    let artworks = [];
    let purchases = [];
    let subscriptions = [];
    let fetchError = false;

    try {
        const [usersData, artsData, purchasesData, subsData] = await Promise.all([
            getAllUsers(),
            getCompanyArts(),
            getAllPurchases(),
            getAllSubscriptions()
        ]);

        users = usersData || [];
        artworks = artsData || [];
        purchases = purchasesData || [];
        subscriptions = subsData || [];
    } catch (error) {
        console.error("Failed to load admin analytics summary:", error);
        fetchError = true;
    }

    // Calculations
    const totalUsers = users.length;
    const totalArtists = users.filter(u => u.role === 'artist').length;
    const totalBuyers = users.filter(u => u.role === 'buyer' || !u.role).length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;
    
    const totalArtworks = artworks.length;
    const artworksSold = purchases.length;

    // Revenue calculations
    const purchaseRevenue = purchases.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    const subRevenue = subscriptions.reduce((acc, s) => {
        const plan = String(s.planId || "").toLowerCase();
        if (plan.includes("premium")) return acc + 19.99;
        if (plan.includes("pro")) return acc + 9.99;
        return acc;
    }, 0);
    const totalRevenue = purchaseRevenue + subRevenue;

    // Secondary metrics
    const averageArtPrice = artworksSold > 0 ? (purchaseRevenue / artworksSold) : 0;
    const activeSubscribers = subscriptions.length;
    
    // Revenue breakdown percentages
    const purchasePct = totalRevenue > 0 ? (purchaseRevenue / totalRevenue) * 100 : 0;
    const subPct = totalRevenue > 0 ? (subRevenue / totalRevenue) * 100 : 0;

    // Artworks by category for listing
    const categoryCounts = artworks.reduce((acc, art) => {
        const cat = art.category || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
    const sortedCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return (
        <div className="space-y-8 pb-10">
            {/* 🏷️ Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-[#121212] rounded-xl border border-white/[0.06] text-white">
                        <Icon icon="solar:chart-2-bold-duotone" className="size-5 text-gray-400" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Analytics Overview</h1>
                        <p className="text-xs text-gray-500 mt-1">Deep-dive performance analytics and key distribution metrics.</p>
                    </div>
                </div>
            </div>

            {fetchError && (
                <div className="bg-red-950/40 border border-red-500/20 text-red-400 p-5 rounded-2xl flex items-start gap-4">
                    <Icon icon="solar:danger-bold" className="size-6 shrink-0 text-red-500 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-sm text-red-200">Server Connectivity Failed</h4>
                        <p className="text-xs text-red-400/80 mt-1 leading-relaxed">
                            Could not synchronize platform analytics metrics with the database. Please ensure the backend is active.
                        </p>
                    </div>
                </div>
            )}

            {/* 📊 KPI Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <div className="bg-[#111111]/80 border border-white/5 rounded-2xl p-6 hover:border-[#D4AF37]/20 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Icon icon="solar:users-group-two-rounded-bold" className="size-24 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Users</span>
                        <div className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-gray-400">
                            <Icon icon="solar:users-group-two-rounded-linear" className="size-4" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight">
                        {totalUsers}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                        Platform-wide registered profiles
                    </p>
                </div>

                {/* Total Artists */}
                <div className="bg-[#111111]/80 border border-white/5 rounded-2xl p-6 hover:border-[#D4AF37]/20 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Icon icon="solar:palette-bold" className="size-24 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Artists</span>
                        <div className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-gray-400">
                            <Icon icon="solar:palette-linear" className="size-4" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight">
                        {totalArtists}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                        Artists creating and listing artworks
                    </p>
                </div>

                {/* Total Artworks Sold */}
                <div className="bg-[#111111]/80 border border-white/5 rounded-2xl p-6 hover:border-[#D4AF37]/20 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Icon icon="solar:cart-large-minimalistic-bold" className="size-24 text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Artworks Sold</span>
                        <div className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-gray-400">
                            <Icon icon="solar:cart-large-minimalistic-linear" className="size-4" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight">
                        {artworksSold}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                        Total items successfully bought
                    </p>
                </div>

                {/* Total Revenue */}
                <div className="bg-[#111111]/80 border border-white/5 rounded-2xl p-6 hover:border-[#D4AF37]/30 transition-all duration-300 relative overflow-hidden group shadow-[0_4px_20px_rgba(212,175,55,0.02)]">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Icon icon="solar:dollar-minimalistic-bold" className="size-24 text-[#D4AF37]" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-[#FFE58F] uppercase tracking-wider">Total Revenue</span>
                        <div className="p-2 bg-[#1c1710] border border-[#D4AF37]/20 rounded-lg text-[#D4AF37]">
                            <Icon icon="solar:dollar-minimalistic-linear" className="size-4" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-[#D4AF37] tracking-tight">
                        ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                        Sales and premium membership fees
                    </p>
                </div>
            </div>

            {/* 📊 Detailed Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Sources and Splits */}
                <div className="lg:col-span-2 bg-[#111111]/40 border border-white/5 rounded-3xl p-6 space-y-6">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
                        <Icon icon="solar:graph-bold-duotone" className="text-[#D4AF37]" />
                        Revenue Source Distribution
                    </h3>
                    
                    <div className="space-y-5">
                        {/* Split Bar */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                                <span>Artwork Purchases ({purchasePct.toFixed(1)}%)</span>
                                <span>Subscriptions ({subPct.toFixed(1)}%)</span>
                            </div>
                            <div className="h-3 w-full bg-zinc-900 border border-white/5 rounded-full overflow-hidden flex">
                                <div className="h-full bg-gradient-to-r from-[#AA7C11] to-[#D4AF37]" style={{ width: `${purchasePct}%` }}></div>
                                <div className="h-full bg-gradient-to-r from-purple-800 to-purple-500" style={{ width: `${subPct}%` }}></div>
                            </div>
                        </div>

                        {/* Split Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-[#141414] border border-white/5 rounded-xl text-left">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Artwork Purchases</span>
                                <h4 className="text-lg font-extrabold text-white mt-1">
                                    ${purchaseRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </h4>
                                <p className="text-[10px] text-gray-500 mt-1">{artworksSold} successful sales</p>
                            </div>
                            <div className="p-4 bg-[#141414] border border-white/5 rounded-xl text-left">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Subscriptions</span>
                                <h4 className="text-lg font-extrabold text-purple-400 mt-1">
                                    ${subRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </h4>
                                <p className="text-[10px] text-gray-500 mt-1">{activeSubscribers} active upgrades</p>
                            </div>
                        </div>
                    </div>

                    {/* Operational Metrics Grid */}
                    <div className="pt-4 border-t border-white/5 space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Performance Indicators</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Average Order Value</span>
                                <span className="text-base font-bold text-white mt-1">${averageArtPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Subscriptions Density</span>
                                <span className="text-base font-bold text-white mt-1">
                                    {totalUsers > 0 ? ((activeSubscribers / totalUsers) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Listing Convert Ratio</span>
                                <span className="text-base font-bold text-white mt-1">
                                    {totalArtworks > 0 ? ((artworksSold / totalArtworks) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categorical Distribution and User Split */}
                <div className="bg-[#111111]/40 border border-white/5 rounded-3xl p-6 space-y-6">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/5">
                        <Icon icon="solar:folder-open-bold-duotone" className="text-[#D4AF37]" />
                        Top Artwork Categories
                    </h3>

                    {sortedCategories.length > 0 ? (
                        <div className="space-y-4">
                            {sortedCategories.map(([category, count]) => (
                                <div key={category} className="space-y-1 text-left">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-semibold text-white">{category}</span>
                                        <span className="font-mono text-gray-400">{count} Listed</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#D4AF37]/50 to-[#D4AF37]" 
                                            style={{ width: `${(count / totalArtworks) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-xs text-gray-600">
                            No categories classified yet.
                        </div>
                    )}

                    {/* User Distribution Split */}
                    <div className="pt-4 border-t border-white/5 space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-left">User Roles Breakdown</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400 flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-500"></span>
                                    Buyers (Standard)
                                </span>
                                <span className="font-bold text-white">{totalBuyers}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400 flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                                    Creators (Artists)
                                </span>
                                <span className="font-bold text-white">{totalArtists}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400 flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                    Admins
                                </span>
                                <span className="font-bold text-white">{totalAdmins}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;