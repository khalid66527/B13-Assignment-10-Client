import React from 'react';
import BuyNowPage from './BuyNowPage';
import { getUserSession } from '@/lib/core/session';
import { getBuynowByBuynower } from '@/lib/api/buynow';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { getPlanById } from '@/lib/api/plans';
import { getArtById } from '@/lib/api/arts';

const BuyNow = async ({ params }) => {
    const { id } = await params;
    const user = await getUserSession();
    const artworkData = await getArtById(id);

    // ধরি ব্যাকএন্ড থেকে এই ইউজারের আগের কেনাকাটার লিস্ট আসছে
    const buynowerPurchase = await getBuynowByBuynower(user.id) ;
    console.log('object',buynowerPurchase );

    const plan =  await getPlanById(user?.plan)
   
    console.log("maxPurchaseMoth",plan);

    const currentPurchases = buynowerPurchase.length;
    const maxPurchases = plan?.maxPurchaseMoth || 3;
    const isLimitExceeded = currentPurchases >= maxPurchases;
    
    // প্রোগ্রেস বারের পার্সেন্টেজ হিসাব
    const progressPercentage = Math.min((currentPurchases / maxPurchases) * 100, 100);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-300 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* 📊 ইউজারের পারচেজ লিমিট ট্র্যাকার কার্ড */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-white/5 rounded-[2rem] p-6 shadow-xl">
                    {/* গোল্ডেন টপ গ্লো লাইন */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl text-[#D4AF37] shrink-0">
                                <Icon icon="solar:star-ring-bold-duotone" className="size-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-bold text-white">Purchase Limit Tracker</h2>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#D4AF37]/10 text-[#FFE58F] border border-[#D4AF37]/20">
                                        {plan?.name || "Free"} Plan
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    You have used <span className="text-white font-bold">{currentPurchases}</span> out of <span className="text-[#D4AF37] font-bold">{maxPurchases}</span> monthly allowed artwork purchases.
                                </p>
                            </div>
                        </div>

                        {/* ডাইনামিক প্রোগ্রেস বার সেকশন */}
                        <div className="w-full md:w-64 space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span className="text-gray-500">Monthly Usage</span>
                                <span className={isLimitExceeded ? "text-red-400 font-bold" : "text-[#D4AF37]"}>
                                    {currentPurchases}/{maxPurchases}
                                </span>
                            </div>
                            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        isLimitExceeded 
                                            ? 'bg-gradient-to-r from-red-500 to-rose-600' 
                                            : 'bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11]'
                                    }`}
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🔒 লিমিট শেষ হয়ে গেলে এই সুন্দর এরর ব্যানারটি স্ক্রিনে দেখাবে */}
                {isLimitExceeded ? (
                    <div className="relative overflow-hidden bg-gradient-to-b from-[#1C1212] to-[#140E0E] border border-red-500/10 rounded-[2.5rem] p-8 text-center shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
                        
                        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500">
                            <Icon icon="solar:lock-keyhole-minimalistic-bold" className="size-8" />
                        </div>
                        
                        <h3 className="text-xl font-extrabold tracking-tight text-white mb-2">
                            Monthly Purchase Limit Reached!
                        </h3>
                        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed mb-6">
                                    You`ve already purchased <span className="text-red-400 font-bold">{currentPurchases} arts</span> this month under your <span className="text-white font-semibold">{plan?.name || "Free"} account</span>. Upgrade your plan to get unlimited lifetime access.
                        </p>
                        
                        <Link
                        href="/plans"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide px-6 py-3 rounded-xl transition-all text-xs shadow-lg">
                            <Icon icon="solar:crown-bold" className="size-4" />
                            Upgrade to Premium
                        </Link>
                    </div>
                ) : (
                    /* 🛒 লিমিট বাকি থাকলে আপনার মেইন BuyNowPage রেন্ডার হবে */
                    <div className="transition-all duration-300">
                        <BuyNowPage user={user} artwork={artworkData} id={id} />
                    </div>
                )}

            </div>
        </div>
    );
};

export default BuyNow;