'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Button } from "@heroui/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { buynowStore } from '@/lib/actions/buynow';
import { useCart } from '@/lib/context/CartContext';
import CommentPage from './comment/CommentPage';

const ArtDetails = ({ allArt, id, user }) => {
    const { addToCart } = useCart();
    const router = useRouter();
    const [isBuying, setIsBuying] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [reviewStats, setReviewStats] = useState({
        averageRating: 5.0,
        totalReviews: 0,
        photoReviewsCount: 0,
    });

    if (!allArt) {
        return (
            <div className="text-center py-20 text-gray-500">
                <Icon icon="solar:danger-circle-linear" className="mx-auto size-12 text-red-500 mb-4" />
                <p>Artwork not found or loading failed.</p>
            </div>
        );
    }

    const { title, category, price, companyId, companyName, dimensions, date, image, description ,artistName ,artistEmail } = allArt;

    const handleBuyNow = async () => {
        if (!user) {
            alert("Please sign in to buy this artwork.");
            router.push(`/auth/signin?redirect=/shop/${id}/buyNow`);
            return;
        }
        setIsBuying(true);

        try {
            setIsBuying(false);
            router.push(`/shop/${id}/buyNow`);
        } catch (error) {
            setIsBuying(false);
            console.error("Error navigating:", error);
            alert("❌ কিছু একটা সমস্যা হয়েছে।");
        }
    };
    return (
        <div className="max-w-6xl mx-auto bg-gradient-to-b from-[#161616]/90 to-[#0F0F0F]/95 backdrop-blur-xl border border-[#D4AF37]/10 rounded-[2.5rem] p-6 md:p-10 shadow-[0_0_50px_rgba(212,175,55,0.03)]">

            {/* দুই কলাম লেআউট */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                {/* 📸 বাম পাশ: ইমেজ সেকশন */}
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

                {/* 📝 ডান পাশ: টেক্সট এবং ইনফরমেশন */}
                <div className="lg:col-span-7 space-y-6">

                    {/* শিরোনাম, স্টার রেটিং ও প্রাইস */}
                    <div className="space-y-3 border-b border-white/5 pb-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                            {title}
                        </h1>

                        {/* ⭐ STAR RATING & PHOTO REVIEWS BADGE */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <a
                                href="#collector-reviews-section"
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#FFE58F] text-xs font-bold transition-all cursor-pointer shadow-sm"
                            >
                                <Icon icon="solar:star-bold" className="size-4 text-[#D4AF37]" />
                                <span>{reviewStats.averageRating.toFixed(1)}</span>
                                <span className="text-gray-400 font-normal">
                                    ({reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'})
                                </span>
                            </a>

                            {reviewStats.photoReviewsCount > 0 && (
                                <a
                                    href="#collector-reviews-section"
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors"
                                >
                                    <Icon icon="solar:camera-bold" className="size-3.5 text-[#D4AF37]" />
                                    <span>{reviewStats.photoReviewsCount} Photo {reviewStats.photoReviewsCount === 1 ? 'Review' : 'Reviews'}</span>
                                </a>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-2xl font-black text-[#D4AF37] pt-1">
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

                    <div className="bg-[#111111] p-4 rounded-2xl border border-white/5">
                        <h1 className='text-xl text-gray-200 pb-2 font-bold'>Artist Details</h1>
                        <div className="grid grid-cols-2 gap-4 ">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-[#D4AF37]">
                                <Icon icon="solar:user-linear" className="size-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Artist Name</p>
                                <p className="text-sm font-semibold text-gray-300">{artistName || 'Custom Size'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-[#1A1A1A] rounded-xl text-[#D4AF37]">
                                <Icon icon="solar:letter-linear" className="size-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Artist Email</p>
                                <p className="text-sm font-semibold text-gray-300">{artistEmail || 'Unknown'}</p>
                            </div>
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
                            className={`size-12 rounded-xl border transition-all shrink-0 ${isBookmarked
                                ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]'
                                : 'bg-[#1A1A1A] border-white/5 text-gray-400 hover:text-white hover:bg-[#222]'
                                }`}
                        >
                            <Icon
                                icon={isBookmarked ? "solar:bookmark-bold" : "solar:bookmark-linear"}
                                className="size-5"
                            />
                        </Button>

                        {/* Add to Cart Button */}
                        <Button
                            onClick={() => addToCart(allArt)}
                            className="w-full sm:w-auto px-6 bg-white/5 hover:bg-white/10 text-white border border-[#D4AF37]/30 hover:border-[#D4AF37] font-bold tracking-wide h-12 rounded-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                        >
                            <Icon icon="solar:cart-plus-bold" className="size-5 text-[#D4AF37]" />
                            Add to Cart
                        </Button>

                        {/* Buy Now Button */}
                        <Button
                            isLoading={isBuying}
                            onClick={handleBuyNow}
                            className="w-full sm:flex-1 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide h-12 rounded-xl transition-all shadow-[0_4px_25px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2 text-sm cursor-pointer"
                        >
                            {!isBuying && <Icon icon="solar:cart-large-minimalistic-bold" className="size-5" />}
                            Buy Now
                        </Button>

                    </div>

                </div>
            </div>

            {/* --- STAR RATING & PHOTO REVIEWS SECTION --- */}
            <CommentPage artworkId={id} user={user} onStatsChange={setReviewStats} />

        </div>
    );
};

export default ArtDetails;