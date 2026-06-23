import React from 'react';
import { getBuynowByBuynower } from '@/lib/api/buynow';
import { getUserSession } from '@/lib/core/session';
import { PurchaseTable } from './PurchaseTable'; 
import { Icon } from '@iconify/react';

const Page = async () => {
    const user = await getUserSession();
    const myPurchaseData = (await getBuynowByBuynower(user?.id)) || [];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* 🏷️ পেজ হেডার */}
                <div className="flex items-center gap-3.5 border-b border-white/[0.06] pb-6">
                    <div className="p-3 bg-[#121212] rounded-xl border border-white/[0.06] text-white">
                        <Icon icon="solar:history-bold-duotone" className="size-5 text-gray-400" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Purchase History</h1>
                        <p className="text-xs text-gray-500 mt-1">Manage and view all your successfully ordered artworks.</p>
                    </div>
                </div>

                {/* 📊 টেবিল রেন্ডার */}
                {myPurchaseData.length > 0 ? (
                    <PurchaseTable data={myPurchaseData} />
                ) : (
                    /* এম্পটি স্টেট */
                    <div className="text-center py-20 bg-[#121212] border border-white/[0.06] rounded-2xl">
                        <Icon icon="solar:gallery-wide-linear" className="size-10 mx-auto text-gray-600 mb-3" />
                        <h3 className="text-sm font-semibold text-white">No Purchases Yet</h3>
                        <p className="text-xs text-gray-500 mt-1">When you buy artworks, they will appear here.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Page;