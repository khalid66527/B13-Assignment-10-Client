import React from 'react';import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Avatar, Button } from '@heroui/react';
import { getAllUsers } from '@/lib/api/alluser';
import { getCompanyArts } from '@/lib/api/arts';
import { getAllPurchases } from '@/lib/api/purchases';
import { getAllSubscriptions } from '@/lib/api/subscriptions';

const AdminDashboardHomePage = async () => {
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
        console.error("Failed to load admin dashboard summary:", error);
        fetchError = true;
    }

    // Calculations
    const totalUsers = users.length;
    const totalArtists = users.filter(u => u.role === 'artist').length;
    const totalArtworks = artworks.length;
    
    // Revenue calculations
    const purchaseRevenue = purchases.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    const subRevenue = subscriptions.reduce((acc, s) => {
        const plan = String(s.planId || "").toLowerCase();
        if (plan.includes("premium")) return acc + 19.99;
        if (plan.includes("pro")) return acc + 9.99;
        return acc;
    }, 0);
    const totalRevenue = purchaseRevenue + subRevenue;

    // Merge and get recent 4 transactions
    const formattedPurchases = purchases.map(p => ({
        id: p._id || p.id,
        type: 'purchase',
        detail: `Artwork bought by ${p.userEmail}`,
        amount: Number(p.price) || 0,
        date: new Date(p?.purchaseDate || Date.now())
    }));

    const formattedSubscriptions = subscriptions.map(s => {
        let amount = 0;
        const plan = String(s.planId || "").toLowerCase();
        if (plan.includes("premium")) amount = 19.99;
        else if (plan.includes("pro")) amount = 9.99;

        return {
            id: s._id || s.id,
            type: 'subscription',
            detail: `${s.email} subscribed to ${s.planId ? s.planId.replace('buynower_', '') : 'plan'}`,
            amount: amount,
            date: new Date(s.createdAt || Date.now())
        };
    });

    const recentTransactions = [...formattedPurchases, ...formattedSubscriptions]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 4);

    // Get 4 most recent registered users (based on position in users array, assuming last added is at beginning or end)
    // In our server user query, they are sorted by _id -1, so index 0 is most recent
    const recentUsers = users.slice(0, 4);

    return (
        <div className="space-y-8 pb-10">
            {/* 🏷️ Welcome Section */}
            <div className="bg-gradient-to-r from-[#161612] via-[#0F0F0C] to-[#0A0A0A] border border-[#D4AF37]/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-[-50%] left-[-20%] w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="space-y-2 z-10">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11] tracking-tight">
                        Welcome Back, Admin
                    </h1>
                    <p className="text-xs text-gray-400 max-w-xl">
                        Here is the high-level summary of your platform statistics. Monitor user roles, supervise artwork listings, and review sales performance.
                    </p>
                </div>
                <div className="flex items-center gap-3 z-10 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 shrink-0">
                    <Icon icon="solar:calendar-date-bold-duotone" className="size-5 text-[#D4AF37]" />
                    <div className="text-left">
                        <p className="text-[10px] text-gray-500 uppercase font-semibold font-mono">Current Date</p>
                        <p className="text-xs text-white font-bold">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {fetchError && (
                <div className="bg-red-950/40 border border-red-500/20 text-red-400 p-5 rounded-2xl flex items-start gap-4">
                    <Icon icon="solar:danger-bold" className="size-6 shrink-0 text-red-500 mt-0.5" />
                    <div>
                        <h4 className="font-bold text-sm text-red-200">Server Connectivity Alert</h4>
                        <p className="text-xs text-red-400/80 mt-1 leading-relaxed">
                            Some summary data could not be fetched from the backend API. Please make sure the server on port 5000 is online.
                        </p>
                    </div>
                </div>
            )}

            {/* 📊 Summary Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Users Card */}
                <Link href="/dashboard/admin/manage-users" className="block group">
                    <div className="bg-[#111111]/80 border border-white/5 hover:border-[#D4AF37]/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_4px_25px_rgba(212,175,55,0.05)] hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-zinc-900 border border-white/5 text-gray-400 rounded-xl group-hover:text-white group-hover:bg-[#1c1710] group-hover:border-[#D4AF37]/20 transition-all">
                                <Icon icon="solar:users-group-two-rounded-bold-duotone" className="size-5" />
                            </div>
                            <Icon icon="solar:arrow-right-linear" className="size-4 text-gray-500 group-hover:text-[#D4AF37] transition-colors" />
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Total Registered Users</p>
                        <h3 className="text-2xl font-black text-white mt-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#FFE58F]">
                            {totalUsers}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-2 font-mono">{totalArtists} Active Artists</p>
                    </div>
                </Link>

                {/* Artworks Card */}
                <Link href="/dashboard/admin/manage-artworks" className="block group">
                    <div className="bg-[#111111]/80 border border-white/5 hover:border-[#D4AF37]/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_4px_25px_rgba(212,175,55,0.05)] hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-zinc-900 border border-white/5 text-gray-400 rounded-xl group-hover:text-white group-hover:bg-[#1c1710] group-hover:border-[#D4AF37]/20 transition-all">
                                <Icon icon="solar:gallery-wide-bold-duotone" className="size-5" />
                            </div>
                            <Icon icon="solar:arrow-right-linear" className="size-4 text-gray-500 group-hover:text-[#D4AF37] transition-colors" />
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Total Artworks Listed</p>
                        <h3 className="text-2xl font-black text-white mt-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#FFE58F]">
                            {totalArtworks}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-2 font-mono">Managed Collections</p>
                    </div>
                </Link>

                {/* Sales Card */}
                <Link href="/dashboard/admin/transactions" className="block group">
                    <div className="bg-[#111111]/80 border border-white/5 hover:border-[#D4AF37]/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_4px_25px_rgba(212,175,55,0.05)] hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-zinc-900 border border-white/5 text-gray-400 rounded-xl group-hover:text-white group-hover:bg-[#1c1710] group-hover:border-[#D4AF37]/20 transition-all">
                                <Icon icon="solar:card-transfer-bold-duotone" className="size-5" />
                            </div>
                            <Icon icon="solar:arrow-right-linear" className="size-4 text-gray-500 group-hover:text-[#D4AF37] transition-colors" />
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Sales & Subs Count</p>
                        <h3 className="text-2xl font-black text-white mt-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#FFE58F]">
                            {purchases.length + subscriptions.length}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-2 font-mono">{purchases.length} Direct Buys</p>
                    </div>
                </Link>

                {/* Revenue Card */}
                <Link href="/dashboard/admin/analytics" className="block group">
                    <div className="bg-[#111111]/80 border border-white/5 hover:border-[#D4AF37]/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_4px_25px_rgba(212,175,55,0.05)] hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-[#1c1710] border border-[#D4AF37]/20 text-[#FFE58F] rounded-xl group-hover:brightness-110 transition-all">
                                <Icon icon="solar:dollar-minimalistic-bold-duotone" className="size-5" />
                            </div>
                            <Icon icon="solar:arrow-right-linear" className="size-4 text-gray-500 group-hover:text-[#D4AF37] transition-colors" />
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Total Platform Revenue</p>
                        <h3 className="text-2xl font-black text-[#D4AF37] mt-1 group-hover:brightness-110">
                            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                        <p className="text-[10px] text-gray-500 mt-2 font-mono">Combined Channels</p>
                    </div>
                </Link>
            </div>

            {/* 🛠️ Quick Admin Shortcuts */}
            <div className="bg-[#111111]/40 border border-white/5 rounded-3xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Icon icon="solar:tuning-square-bold-duotone" className="text-[#D4AF37]" />
                    Administrative Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Link href="/dashboard/admin/manage-users" className="flex flex-col items-center justify-center p-4 bg-[#141414] hover:bg-[#1c1710] border border-white/5 hover:border-[#D4AF37]/20 rounded-2xl text-center transition-all group">
                        <Icon icon="solar:users-group-rounded-linear" className="size-6 text-gray-400 group-hover:text-[#D4AF37] mb-2 transition-colors" />
                        <span className="text-xs text-gray-300 group-hover:text-white font-medium">Manage Users</span>
                    </Link>
                    <Link href="/dashboard/admin/manage-artworks" className="flex flex-col items-center justify-center p-4 bg-[#141414] hover:bg-[#1c1710] border border-white/5 hover:border-[#D4AF37]/20 rounded-2xl text-center transition-all group">
                        <Icon icon="solar:gallery-wide-linear" className="size-6 text-gray-400 group-hover:text-[#D4AF37] mb-2 transition-colors" />
                        <span className="text-xs text-gray-300 group-hover:text-white font-medium">Manage Artworks</span>
                    </Link>
                    <Link href="/dashboard/admin/transactions" className="flex flex-col items-center justify-center p-4 bg-[#141414] hover:bg-[#1c1710] border border-white/5 hover:border-[#D4AF37]/20 rounded-2xl text-center transition-all group">
                        <Icon icon="solar:card-transfer-linear" className="size-6 text-gray-400 group-hover:text-[#D4AF37] mb-2 transition-colors" />
                        <span className="text-xs text-gray-300 group-hover:text-white font-medium">View Transactions</span>
                    </Link>
                    <Link href="/dashboard/admin/analytics" className="flex flex-col items-center justify-center p-4 bg-[#141414] hover:bg-[#1c1710] border border-white/5 hover:border-[#D4AF37]/20 rounded-2xl text-center transition-all group">
                        <Icon icon="solar:chart-2-linear" className="size-6 text-gray-400 group-hover:text-[#D4AF37] mb-2 transition-colors" />
                        <span className="text-xs text-gray-300 group-hover:text-white font-medium">Analytics Summary</span>
                    </Link>
                    <Link href="/dashboard/admin/charts" className="flex flex-col items-center justify-center p-4 bg-[#141414] hover:bg-[#1c1710] border border-white/5 hover:border-[#D4AF37]/20 rounded-2xl text-center transition-all col-span-2 md:col-span-1 group">
                        <Icon icon="solar:pie-chart-3-linear" className="size-6 text-gray-400 group-hover:text-[#D4AF37] mb-2 transition-colors" />
                        <span className="text-xs text-gray-300 group-hover:text-white font-medium">Charts & Trends</span>
                    </Link>
                </div>
            </div>

            {/* 📋 Recent Feeds (Split Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Transactions */}
                <div className="bg-[#111111]/40 border border-white/5 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Icon icon="solar:bill-list-bold-duotone" className="text-[#D4AF37]" />
                            Recent Activity
                        </h3>
                        <Link href="/dashboard/admin/transactions" className="text-xs text-[#D4AF37] hover:underline font-medium">
                            View All
                        </Link>
                    </div>

                    {recentTransactions.length > 0 ? (
                        <div className="space-y-3">
                            {recentTransactions.map(tx => (
                                <div key={tx.id} className="flex items-center justify-between p-3 bg-[#121212]/70 border border-white/5 rounded-xl hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${tx.type === 'purchase' ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                            <Icon icon={tx.type === 'purchase' ? 'solar:gallery-bold' : 'solar:crown-minimalistic-bold'} className="size-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-white font-medium truncate max-w-[200px] sm:max-w-[300px]">
                                                {tx.detail}
                                            </p>
                                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                                                {tx.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-white shrink-0">
                                        +${tx.amount.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-xs">
                            No recent transaction activity.
                        </div>
                    )}
                </div>

                {/* Recent Users */}
                <div className="bg-[#111111]/40 border border-white/5 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-[#D4AF37]" />
                            Newly Registered Users
                        </h3>
                        <Link href="/dashboard/admin/manage-users" className="text-xs text-[#D4AF37] hover:underline font-medium">
                            Manage Users
                        </Link>
                    </div>

                    {recentUsers.length > 0 ? (
                        <div className="space-y-3">
                            {recentUsers.map(user => {
                                const userId = user._id || user.id;
                                return (
                                    <div key={userId} className="flex items-center justify-between p-3 bg-[#121212]/70 border border-white/5 rounded-xl hover:border-white/10 transition-all">
                                        <div className="flex items-center gap-3">
                                            <Avatar size="sm" className="rounded-full border border-white/10 shrink-0">
                                                <Avatar.Image src={user.image} />
                                                <Avatar.Fallback>
                                                    <Icon icon="solar:user-bold" className="size-3.5 text-gray-400" />
                                                </Avatar.Fallback>
                                            </Avatar>
                                            <div className="text-left">
                                                <p className="text-xs text-white font-medium">
                                                    {user.name || "N/A"}
                                                </p>
                                                <p className="text-[10px] text-gray-500 truncate max-w-[180px] sm:max-w-[280px]">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            {user.role === 'admin' ? (
                                                <span className="text-[9px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">Admin</span>
                                            ) : user.role === 'artist' ? (
                                                <span className="text-[9px] font-bold uppercase bg-[#D4AF37]/10 text-[#FFE58F] border border-[#D4AF37]/20 px-2 py-0.5 rounded">Artist</span>
                                            ) : (
                                                <span className="text-[9px] font-bold uppercase bg-zinc-800 text-zinc-400 border border-white/5 px-2 py-0.5 rounded">User</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-xs">
                            No newly registered users.
                        </div>
                    )}
                </div>
            </div>
Page
        </div>
    );
};

export default AdminDashboardHomePage;