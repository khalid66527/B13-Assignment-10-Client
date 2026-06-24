"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@heroui/react';

const BuyNowPage = ({ user, artwork, id }) => {
    console.log('user' , user);
    console.log('artwork' , artwork);
    const router = useRouter();
    const [toast, setToast] = useState({ show: false, message: '' });

    // ১. ইউজার না থাকলে সাইন-ইন পেজে রিডাইরেক্ট (useEffect এর মাধ্যমে করা হয়েছে ক্লায়েন্ট সাইডে)
    useEffect(() => {
        if (!user) {
            router.push(`/auth/signin?redirect=/shop/${id}/buyNow`);
        }
    }, [user, id, router]);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <Icon icon="eos-icons:loading" className="size-10 text-[#D4AF37] animate-spin" />
            </div>
        );
    }

    
    if (user.role === "artist") {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-[#0A0A0A] px-4">
                <div className="relative w-full max-w-md bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-red-500/20 rounded-[2rem] p-8 md:p-10 shadow-[0_0_50px_rgba(239,68,68,0.02)] text-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
                    <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500">
                        <Icon icon="solar:lock-keyhole-minimalistic-bold" className="size-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-white mb-3">Access Denied</h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Artists are not allowed to purchase artwork. Please sign in with a <span className="text-[#D4AF37] font-semibold">Buyer account</span> to continue.
                        </p>
                        <Link
                            href={`/auth/signin?redirect=/shop/${id}/buyNow`}
                            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide py-3.5 rounded-xl transition-all text-sm shadow-[0_4px_20px_rgba(212,175,55,0.15)]"
                        >
                            <Icon icon="solar:user-speak-rounded-bold" className="size-5" />
                            Sign in with another account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ৩. ডাইনামিক কার্ট অ্যারে (ইউজার যে আইটেমে ক্লিক করেছে তার ডাটা এখানে সরাসরি ম্যাপ হবে)
    const cartItems = artwork ? [
        {
            id: id,
            title: artwork.title || "Untitled Artwork",
            category: artwork.category || "General",
            price: artwork.price || 0,
            image: artwork.image || "https://placehold.co/150"
        }
    ] : [];

    const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price || 0), 0);
    const shipping = cartItems.length > 0 ? 0 : 0; 
    const totalAmount = subtotal + shipping;

    const handleCheckoutClick = () => {
        setToast({ show: true, message: "Order placed successfully! Thank you for your purchase." });
        setTimeout(() => {
            setToast({ show: false, message: "" });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Custom Toast Notification */}
            {toast.show && (
                <div 
                    className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#161616] border border-[#D4AF37]/30 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.15)] transition-all duration-300"
                    style={{
                        animation: 'slideIn 0.3s ease-out forwards',
                    }}
                >
                    <style>{`
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    `}</style>
                    <div className="p-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg">
                        <Icon icon="solar:check-circle-bold" className="size-5" />
                    </div>
                    <div className="text-sm font-semibold tracking-wide text-white">
                        {toast.message}
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">

                {/* পেজ হেডার */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-[#161616] rounded-2xl border border-white/5 text-[#D4AF37]">
                        <Icon icon="solar:cart-large-linear" className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Review Your Order</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Manage your selected items and proceed to checkout.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* 📋 বাম পাশ: কার্ট টেবিল সেকশন */}
                    <div className="lg:col-span-8 bg-[#161616]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-[#161616] text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        <th className="py-4 px-6">Artwork Details</th>
                                        <th className="py-4 px-6">Category</th>
                                        <th className="py-4 px-6 text-right">Price</th>
                                        <th className="py-4 px-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {cartItems.map((item, index) => (
                                        <tr key={item.id || index} className="hover:bg-white/[0.02] transition-colors group">
                                            {/* ইমেজ ও টাইটেল */}
                                            <td className="py-4 px-6 flex items-center gap-4">
                                                <div className="size-14 rounded-xl bg-[#1A1A1A] overflow-hidden border border-white/5 shrink-0">
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-semibold text-white line-clamp-1 group-hover:text-[#FFE58F] transition-colors">
                                                    {item.title}
                                                </span>
                                            </td>

                                            {/* ক্যাটাগরি */}
                                            <td className="py-4 px-6">
                                                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/5 text-gray-400">
                                                    {item.category}
                                                </span>
                                            </td>

                                            {/* প্রাইজ */}
                                            <td className="py-4 px-6 text-right font-bold text-[#D4AF37]">
                                                ${item.price}
                                            </td>

                                            {/* অ্যাকশন বাটনসমূহ */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/shop/${item.id}`}
                                                        className="p-2 bg-[#1A1A1A] hover:bg-[#D4AF37]/10 text-gray-400 hover:text-[#D4AF37] border border-white/5 rounded-xl transition-all"
                                                        title="View Artwork"
                                                    >
                                                        <Icon icon="solar:eye-linear" className="size-4" />
                                                    </Link>

                                                    <button
                                                        onClick={() => router.push('/shop')}
                                                        className="p-2 bg-[#1A1A1A] hover:bg-red-500/10 text-gray-400 hover:text-red-500 border border-white/5 rounded-xl transition-all"
                                                        title="Remove Item"
                                                    >
                                                        <Icon icon="solar:trash-bin-trash-linear" className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 💰 ডান পাশ: অর্ডার সামারি ও চেকআউট বাটন */}
                    <div className="lg:col-span-4 bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
                        <h3 className="text-base font-bold text-white tracking-wide border-b border-white/5 pb-3">
                            Order Summary
                        </h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span className="font-semibold text-white">${subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Estimated Shipping</span>
                                <span className="font-semibold text-white">${shipping}</span>
                            </div>
                            <div className="h-[1px] bg-white/5 my-2"></div>
                            <div className="flex justify-between text-base font-bold">
                                <span className="text-white">Total Amount</span>
                                <span className="text-[#D4AF37]">${totalAmount}</span>
                            </div>
                        </div>

                        <form action="/api/checkout_sessions" method="POST" className="w-full">
                            <input type="hidden" name="checkout_type" value="purchase" />
                            <input type="hidden" name="art_id" value={artwork._id || id} />
                            <input type="hidden" name="title" value={artwork.title || ""} />
                            <input type="hidden" name="price" value={artwork.price || 0} />
                            <input type="hidden" name="image" value={artwork.image || ""} />
                            <input type="hidden" name="artistEmail" value={artwork.artistEmail || ""} />
                            <input type="hidden" name="artistName" value={artwork.artistName || ""} />
                            <input type="hidden" name="companyName" value={artwork.companyName || ""} />
                            <input type="hidden" name="companyId" value={artwork.companyId || ""} />
                            <input type="hidden" name="category" value={artwork.category || ""} />
                            <input type="hidden" name="dimensions" value={artwork.dimensions || ""} />
                            <input type="hidden" name="date" value={artwork.date || ""} />
                            <input type="hidden" name="description" value={artwork.description || ""} />
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-black tracking-wide h-12 rounded-xl transition-all shadow-[0_4px_25px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2 text-sm"
                            >
                                <Icon icon="solar:card-transfer-bold" className="size-5" />
                                Proceed to Checkout
                            </Button>
                        </form>

                        <p className="text-[11px] text-center text-gray-500 leading-relaxed">
                            By clicking proceed, you agree to our terms of digital and custom physical artwork distribution rights.
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default BuyNowPage;