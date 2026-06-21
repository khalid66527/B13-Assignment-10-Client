'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Button } from "@heroui/react";
import Link from 'next/link';

const ArtDetails = ({ allArt, id }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);

    // ডাটা না থাকলে সেফটি হ্যান্ডেলিং
    if (!allArt) {
        return (
            <div className="text-center py-20 text-gray-500">
                <Icon icon="solar:danger-circle-linear" className="mx-auto size-12 text-red-500 mb-4" />
                <p>Artwork not found or loading failed.</p>
            </div>
        );
    }

    const { title, category, price, dimensions, date, image, description } = allArt;

    return (
        <div className="max-w-6xl mx-auto bg-gradient-to-b from-[#161616]/90 to-[#0F0F0F]/95 backdrop-blur-xl border border-[#D4AF37]/10 rounded-[2.5rem] p-6 md:p-10 shadow-[0_0_50px_rgba(212,175,55,0.03)]">
            
            {/* দুই কলাম লেআউট (মোবাইলে সিঙ্গেল কলাম, ট্যাবে/ডেস্কটপে ২ কলাম) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* 📸 বাম পাশ: ইমেজ সেকশন (১২ ভাগের ৫ ভাগ জায়গা নেবে) */}
                <div className="lg:col-span-5 w-full aspect-[4/5] rounded-3xl overflow-hidden bg-[#1A1A1A] border border-white/5 relative group shadow-2xl">
                    <img 
                        src={image || "https://placehold.co/600x800/1a1a1a/ffffff?text=No+Image"} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                    />
                    {/* ক্যাটাগরি ব্যাজ ইমেজের ওপর */}
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-[#D4AF37]/30 px-3 py-1 rounded-xl text-xs font-bold text-[#FFE58F] tracking-wide uppercase">
                        {category}
                    </div>
                </div>

                {/* 📝 ডান পাশ: টেক্সট এবং ইনফরমেশন (১২ ভাগের ৭ ভাগ জায়গা নেবে) */}
                <div className="lg:col-span-7 space-y-6">
                    
                    {/* শিরোনাম ও প্রাইস */}
                    <div className="space-y-2 border-b border-white/5 pb-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                            {title}
                        </h1>
                        <div className="flex items-center gap-2 text-2xl font-black text-[#D4AF37]">
                            <span>${price}</span>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">USD</span>
                        </div>
                    </div>

                    {/* মেটাডাটা গ্রিড (ডাইমেনশন ও রিলিজ ডেট) */}
                    <div className="grid grid-cols-2 gap-4 bg-[#111111] p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-[#D4AF37]">
                                <Icon icon="solar:ruler-angular-linear" className="size-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Dimensions</p>
                                <p className="text-sm font-semibold text-gray-300">{dimensions || 'Custom Size'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-[#D4AF37]">
                                <Icon icon="solar:calendar-linear" className="size-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Release Date</p>
                                <p className="text-sm font-semibold text-gray-300">{date || 'Unknown'}</p>
                            </div>
                        </div>
                    </div>

                    {/* ডেসক্রিপশন */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">About This Artwork</h3>
                        <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                            {description || 'No description provided for this exquisite masterpiece.'}
                        </p>
                    </div>

                    {/* 🔘 অ্যাকশন বাটনসমূহ */}
                    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center gap-4">
                        
                        {/* Bookmark Button */}
                        <Button
                            isIconOnly
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`size-12 rounded-xl border transition-all shrink-0 ${
                                isBookmarked 
                                    ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]' 
                                    : 'bg-[#1A1A1A] border-white/5 text-gray-400 hover:text-white hover:bg-[#222]'
                            }`}
                        >
                            <Icon 
                                icon={isBookmarked ? "solar:bookmark-bold" : "solar:bookmark-linear"} 
                                className="size-5" 
                            />
                        </Button>

                        {/* Buy Now Button */}
                        <Link
                            href={`/shop/${id}/buyNow`}
                            className="w-full sm:flex-1 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide h-12 rounded-xl transition-all shadow-[0_4px_25px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2 text-sm"
                            
                        >
                            <Icon icon="solar:cart-large-minimalistic-bold" className="size-5" />
                            Buy Now
                        </Link>
                        
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ArtDetails;