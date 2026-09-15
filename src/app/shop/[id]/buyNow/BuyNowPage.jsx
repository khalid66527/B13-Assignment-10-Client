"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@heroui/react';
import { getUserAddresses } from '@/lib/api/address';
import { addUserAddress, updateUserAddress, setDefaultAddress } from '@/lib/actions/address';
import { BANGLADESH_DIVISIONS, BD_DISTRICTS, BD_THANAS } from '@/lib/data/locations';

const BuyNowPage = ({ user, artwork, id, initialAddresses = [] }) => {
    const router = useRouter();

    // 📬 Addresses State
    const [addresses, setAddresses] = useState(initialAddresses || []);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(() => {
        const defaultAddr = (initialAddresses || []).find(a => a.isDefault);
        return defaultAddr?._id || initialAddresses?.[0]?._id || null;
    });

    // Modals state
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Address Form Data
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        division: 'Dhaka',
        district: 'Dhaka City',
        thana: 'Dhanmondi',
        street: '',
        landmark: '',
        address: '',
        label: 'Home',
        isDefault: true,
    });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    // Re-fetch addresses helper
    const reloadAddresses = async (preferredId = null) => {
        try {
            setLoadingAddresses(true);
            const userAddrs = await getUserAddresses(user?.email, user?.id);
            const list = Array.isArray(userAddrs) ? userAddrs : [];
            setAddresses(list);

            if (preferredId && list.some(a => a._id === preferredId)) {
                setSelectedAddressId(preferredId);
            } else if (!list.some(a => a._id === selectedAddressId)) {
                const def = list.find(a => a.isDefault);
                setSelectedAddressId(def?._id || list[0]?._id || null);
            }
        } catch (err) {
            console.error('Failed to load user addresses:', err);
        } finally {
            setLoadingAddresses(false);
        }
    };

    // Fetch addresses on mount if not provided
    useEffect(() => {
        if (user && (!initialAddresses || initialAddresses.length === 0)) {
            reloadAddresses();
        }
    }, [user]);

    // Update selectedAddressId if addresses change
    useEffect(() => {
        if (addresses.length > 0) {
            const hasSelected = addresses.some(a => a._id === selectedAddressId);
            if (!hasSelected) {
                const def = addresses.find(a => a.isDefault);
                setSelectedAddressId(def?._id || addresses[0]?._id || null);
            }
        } else {
            setSelectedAddressId(null);
        }
    }, [addresses]);

    // Active selected address
    const selectedAddress = addresses.find(a => a._id === selectedAddressId) || addresses[0] || null;

    // User authentication redirect
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

    // Dynamic cart item
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
    const shipping = 0;
    const totalAmount = subtotal + shipping;

    // Address Cascading dropdown helpers
    const cleanDivKey = (formData.division || "Dhaka").split(" ")[0];
    const availableDistricts = BD_DISTRICTS[cleanDivKey] || BD_DISTRICTS[formData.division] || BD_DISTRICTS["Dhaka"] || [];
    const cleanDistKey = formData.district || availableDistricts[0] || "Dhaka City";
    const availableThanas = BD_THANAS[cleanDistKey] || BD_THANAS[cleanDistKey.split(" ")[0]] || ["Sadar", "Other"];

    const handleDivisionChange = (newDivision) => {
        const key = (newDivision || "Dhaka").split(" ")[0];
        const newDistricts = BD_DISTRICTS[key] || BD_DISTRICTS[newDivision] || BD_DISTRICTS["Dhaka"] || [];
        const firstDistrict = newDistricts[0] || "";
        const distKey = (firstDistrict || "").split(" ")[0];
        const newThanas = BD_THANAS[firstDistrict] || BD_THANAS[distKey] || ["Sadar", "Other"];
        setFormData((prev) => ({ ...prev, division: newDivision, district: firstDistrict, thana: newThanas[0] || "" }));
    };

    const handleDistrictChange = (newDistrict) => {
        const key = (newDistrict || "").split(" ")[0];
        const newThanas = BD_THANAS[newDistrict] || BD_THANAS[key] || ["Sadar", "Other"];
        setFormData((prev) => ({ ...prev, district: newDistrict, thana: newThanas[0] || "" }));
    };

    const handleOpenAddModal = () => {
        setEditingAddress(null);
        setFormData({
            fullName: user?.name || '',
            phone: '',
            division: 'Dhaka',
            district: 'Dhaka City',
            thana: 'Dhanmondi',
            street: '',
            landmark: '',
            address: '',
            label: 'Home',
            isDefault: addresses.length === 0,
        });
        setIsAddressModalOpen(true);
    };

    const handleOpenEditModal = (addr) => {
        setEditingAddress(addr);
        setFormData({
            fullName: addr.fullName || '',
            phone: addr.phone || '',
            division: addr.division || addr.state || 'Dhaka',
            district: addr.district || addr.city || 'Dhaka City',
            thana: addr.thana || 'Dhanmondi',
            street: addr.street || '',
            landmark: addr.landmark || '',
            address: addr.address || addr.street || '',
            label: addr.label || 'Home',
            isDefault: addr.isDefault === true,
        });
        setIsAddressModalOpen(true);
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.phone || !formData.division || !formData.district || !formData.street) {
            showToast('Please fill in Full Name, Phone, Division, City, and Street Address.', 'error');
            return;
        }

        try {
            setIsSubmittingAddress(true);
            const payload = {
                ...formData,
                city: formData.district,
                state: formData.division,
                country: 'Bangladesh',
                zipCode: '',
                userEmail: user?.email || '',
                userId: user?.id || '',
            };

            let savedAddrId = null;
            if (editingAddress?._id) {
                await updateUserAddress(editingAddress._id, payload);
                savedAddrId = editingAddress._id;
                showToast('Delivery address updated successfully!');
            } else {
                const res = await addUserAddress(payload);
                savedAddrId = res?.insertedId || res?._id || null;
                showToast('Delivery address saved successfully!');
            }

            setIsAddressModalOpen(false);
            await reloadAddresses(savedAddrId);
        } catch (err) {
            console.error('Error saving address:', err);
            showToast('Failed to save address. Please try again.', 'error');
        } finally {
            setIsSubmittingAddress(false);
        }
    };

    // Checkout Form Submission Check
    const handleCheckoutSubmit = (e) => {
        if (!selectedAddress || addresses.length === 0) {
            e.preventDefault();
            showToast('Please provide your delivery address before proceeding to checkout!', 'error');
            handleOpenAddModal();
        }
    };

    // Formatted delivery address text
    const formatAddressString = (addr) => {
        if (!addr) return '';
        const parts = [];
        if (addr.street) parts.push(addr.street);
        if (addr.landmark) parts.push(`(${addr.landmark})`);
        if (addr.thana) parts.push(addr.thana);
        if (addr.district || addr.city) parts.push(addr.district || addr.city);
        if (addr.division || addr.state) parts.push(addr.division || addr.state);
        return parts.join(', ');
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-300 py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Custom Toast Notification */}
            {toast.show && (
                <div 
                    className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border transition-all duration-300 ${
                        toast.type === 'error'
                            ? 'bg-[#1C1111] border-red-500/50 text-red-200'
                            : 'bg-[#161616] border-[#D4AF37]/40 text-white'
                    }`}
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
                    <div className={`p-1 rounded-lg ${toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-[#D4AF37]/15 text-[#D4AF37]'}`}>
                        <Icon icon={toast.type === 'error' ? 'solar:danger-circle-bold' : 'solar:check-circle-bold'} className="size-5" />
                    </div>
                    <div className="text-sm font-semibold tracking-wide">
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
                        <p className="text-xs text-gray-500 mt-0.5">Verify your delivery address & artwork details before checking out.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* 📋 বাম পাশ: কার্ট টেবিল ও আইটেম সেকশন */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-[#161616]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-base font-bold text-white flex items-center gap-2">
                                    <Icon icon="solar:gallery-bold-duotone" className="size-5 text-[#D4AF37]" />
                                    Selected Artwork ({cartItems.length})
                                </h2>
                                <Link 
                                    href="/shop" 
                                    className="text-xs font-semibold text-[#D4AF37] hover:text-[#FFE58F] transition-colors flex items-center gap-1"
                                >
                                    <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
                                    Explore More
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-[#161616] text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                            <th className="py-4 px-6">Artwork</th>
                                            <th className="py-4 px-4">Category</th>
                                            <th className="py-4 px-6 text-right">Price</th>
                                            <th className="py-4 px-4 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {cartItems.map((item, index) => (
                                            <tr key={item.id || index} className="hover:bg-white/[0.02] transition-colors group">
                                                {/* ইমেজ ও টাইটেল */}
                                                <td className="py-4 px-6 flex items-center gap-4">
                                                    <div className="size-16 rounded-xl bg-[#1A1A1A] overflow-hidden border border-white/5 shrink-0 shadow-md">
                                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="font-semibold text-white line-clamp-1 group-hover:text-[#FFE58F] transition-colors block text-sm">
                                                            {item.title}
                                                        </span>
                                                        <span className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                                            Original Verified Artwork
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* ক্যাটাগরি */}
                                                <td className="py-4 px-4">
                                                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 border border-white/5 text-gray-300">
                                                        {item.category}
                                                    </span>
                                                </td>

                                                {/* প্রাইজ */}
                                                <td className="py-4 px-6 text-right font-bold text-[#D4AF37] text-base">
                                                    ${item.price}
                                                </td>

                                                {/* অ্যাকশন বাটনসমূহ */}
                                                <td className="py-4 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <Link
                                                            href={`/shop/${item.id}`}
                                                            className="p-2 bg-[#1A1A1A] hover:bg-[#D4AF37]/10 text-gray-400 hover:text-[#D4AF37] border border-white/5 rounded-xl transition-all"
                                                            title="View Artwork"
                                                        >
                                                            <Icon icon="solar:eye-linear" className="size-4" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => router.push('/shop')}
                                                            className="p-2 bg-[#1A1A1A] hover:bg-red-500/10 text-gray-400 hover:text-red-500 border border-white/5 rounded-xl transition-all cursor-pointer"
                                                            title="Cancel / Return to Shop"
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

                        {/* 🛡️ Secure Delivery & Authenticity Guarantee Notice */}
                        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                            <div className="p-2.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl shrink-0">
                                <Icon icon="solar:shield-check-bold-duotone" className="size-6" />
                            </div>
                            <div className="text-xs leading-relaxed">
                                <h4 className="font-bold text-white mb-1">Authentic & Insured Delivery</h4>
                                <p className="text-gray-400">
                                    Every artwork is packaged in specialized archival materials and dispatched directly to your saved delivery address with door-to-door tracking.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 💰 ডান পাশ: ডেলিভারি অ্যাড্রেস ও অর্ডার সামারি সেকশন */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* 🏠 ডেলিভারি অ্যাড্রেস কার্ড (এখানে ইউজার তার অ্যাড্রেস দেখতে বা পরিবর্তন করতে পারবে) */}
                        <div className="bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>

                            <div className="flex items-center justify-between pb-3.5 border-b border-white/5 mb-4">
                                <div className="flex items-center gap-2">
                                    <Icon icon="solar:map-point-wave-bold-duotone" className="size-5 text-[#D4AF37]" />
                                    <h3 className="text-sm font-bold text-white tracking-wide">
                                        Delivery Address
                                    </h3>
                                </div>
                                {selectedAddress && (
                                    <div className="flex items-center gap-2">
                                        {addresses.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setIsSelectModalOpen(true)}
                                                className="text-[11px] font-bold text-[#D4AF37] hover:text-[#FFE58F] underline underline-offset-2 transition-colors cursor-pointer"
                                            >
                                                Change
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditModal(selectedAddress)}
                                            className="p-1 px-2 text-[11px] rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                                            title="Edit this address"
                                        >
                                            <Icon icon="solar:pen-linear" className="size-3 text-[#D4AF37]" />
                                            <span>Edit</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* অ্যাড্রেস আছে কি নেই তার উপর নির্ভর করে রেন্ডার */}
                            {selectedAddress ? (
                                <div className="space-y-3 bg-[#111111]/80 border border-[#D4AF37]/25 rounded-2xl p-4 relative group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white text-sm">{selectedAddress.fullName}</span>
                                            <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-[#D4AF37]/15 text-[#FFE58F] border border-[#D4AF37]/30">
                                                {selectedAddress.label || "Home"}
                                            </span>
                                            {selectedAddress.isDefault && (
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
                                        <Icon icon="solar:phone-calling-rounded-bold" className="size-3.5 text-[#D4AF37] shrink-0" />
                                        <span>{selectedAddress.phone}</span>
                                    </div>

                                    <p className="text-xs text-gray-300 leading-relaxed font-normal">
                                        {formatAddressString(selectedAddress)}
                                    </p>

                                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Icon icon="solar:check-circle-bold" className="size-3.5" />
                                            Verified Delivery Location
                                        </span>
                                        {addresses.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setIsSelectModalOpen(true)}
                                                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                            >
                                                +{addresses.length - 1} other address(es)
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* ⚠️ নো অ্যাড্রেস ওয়ার্নিং ও অ্যাড বাটন */
                                <div className="bg-[#1F1212]/90 border border-red-500/30 rounded-2xl p-4 text-center space-y-3">
                                    <div className="size-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
                                        <Icon icon="solar:map-point-remove-bold" className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Shipping Address Required</h4>
                                        <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                                            You must add a delivery address before you can proceed to checkout.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleOpenAddModal}
                                        className="w-full py-2.5 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Icon icon="solar:add-circle-bold" className="size-4" />
                                        Add Delivery Address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 💵 অর্ডার সামারি কার্ড */}
                        <div className="bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-white/5 rounded-3xl p-6 shadow-xl space-y-5">
                            <h3 className="text-base font-bold text-white tracking-wide border-b border-white/5 pb-3 flex items-center justify-between">
                                <span>Order Summary</span>
                                <span className="text-xs font-medium text-gray-500">{cartItems.length} Item</span>
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Artwork Price</span>
                                    <span className="font-semibold text-white">${subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Insured Courier Shipping</span>
                                    <span className="font-semibold text-emerald-400">FREE</span>
                                </div>
                                <div className="h-[1px] bg-white/5 my-2"></div>
                                <div className="flex justify-between text-base font-bold">
                                    <span className="text-white">Total Amount</span>
                                    <span className="text-[#D4AF37] text-xl font-extrabold">${totalAmount}</span>
                                </div>
                            </div>

                            {/* 💳 চেকআউট ফর্ম */}
                            <form 
                                action="/api/checkout_sessions" 
                                method="POST" 
                                onSubmit={handleCheckoutSubmit}
                                className="w-full space-y-3"
                            >
                                <input type="hidden" name="checkout_type" value="purchase" />
                                <input type="hidden" name="art_id" value={artwork?._id || id} />
                                <input type="hidden" name="title" value={artwork?.title || ""} />
                                <input type="hidden" name="price" value={artwork?.price || 0} />
                                <input type="hidden" name="image" value={artwork?.image || ""} />
                                <input type="hidden" name="artistEmail" value={artwork?.artistEmail || ""} />
                                <input type="hidden" name="artistName" value={artwork?.artistName || ""} />
                                <input type="hidden" name="companyName" value={artwork?.companyName || ""} />
                                <input type="hidden" name="companyId" value={artwork?.companyId || ""} />
                                <input type="hidden" name="category" value={artwork?.category || ""} />
                                <input type="hidden" name="dimensions" value={artwork?.dimensions || ""} />
                                <input type="hidden" name="date" value={artwork?.date || ""} />
                                <input type="hidden" name="description" value={artwork?.description || ""} />

                                {/* Hidden Shipping Address Details for Stripe Metadata */}
                                <input type="hidden" name="address_id" value={selectedAddress?._id || ""} />
                                <input type="hidden" name="shipping_name" value={selectedAddress?.fullName || ""} />
                                <input type="hidden" name="shipping_phone" value={selectedAddress?.phone || ""} />
                                <input type="hidden" name="shipping_address" value={formatAddressString(selectedAddress)} />

                                <Button
                                    type="submit"
                                    className={`w-full font-black tracking-wide h-13 rounded-xl transition-all shadow-[0_4px_25px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2 text-sm cursor-pointer ${
                                        selectedAddress
                                            ? 'bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black'
                                            : 'bg-[#2A2415] text-[#FFE58F]/70 border border-[#D4AF37]/30 hover:bg-[#382E19]'
                                    }`}
                                >
                                    <Icon icon="solar:card-transfer-bold" className="size-5" />
                                    {selectedAddress ? "Proceed to Checkout" : "Add Address & Checkout"}
                                </Button>
                            </form>

                            <p className="text-[11px] text-center text-gray-500 leading-relaxed">
                                By clicking proceed, you agree to ArtHall terms and verified courier dispatch terms.
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* ========================================================================= */}
            {/* 🏷️ MODAL 1: SELECT / SWITCH SAVED ADDRESS */}
            {/* ========================================================================= */}
            {isSelectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-lg bg-[#141414] rounded-3xl shadow-2xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161616]">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Icon icon="solar:map-point-wave-bold-duotone" className="size-5 text-[#D4AF37]" />
                                Select Delivery Address
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsSelectModalOpen(false)}
                                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <Icon icon="solar:close-circle-bold" className="size-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-3 flex-1">
                            {addresses.map((addr) => {
                                const isSelected = addr._id === selectedAddressId;
                                return (
                                    <div
                                        key={addr._id}
                                        onClick={() => {
                                            setSelectedAddressId(addr._id);
                                            setIsSelectModalOpen(false);
                                            showToast('Delivery address selected!');
                                        }}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                                            isSelected
                                                ? 'bg-[#1D1B13] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                                                : 'bg-[#181818] border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white text-sm">{addr.fullName}</span>
                                                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/10 text-gray-300">
                                                    {addr.label || "Home"}
                                                </span>
                                                {addr.isDefault && (
                                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400">{formatAddressString(addr)}</p>
                                            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                                <Icon icon="solar:phone-calling-rounded-bold" className="size-3 text-[#D4AF37]" />
                                                <span>{addr.phone}</span>
                                            </div>
                                        </div>

                                        <div className="shrink-0 mt-1">
                                            <div className={`size-5 rounded-full border flex items-center justify-center ${
                                                isSelected ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-white/30'
                                            }`}>
                                                {isSelected && <Icon icon="solar:check-bold" className="size-3" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-4 border-t border-white/10 bg-[#161616] flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSelectModalOpen(false);
                                    handleOpenAddModal();
                                }}
                                className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:text-[#FFE58F] transition-colors cursor-pointer"
                            >
                                <Icon icon="solar:add-circle-bold" className="size-4" />
                                Add Another Address
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsSelectModalOpen(false)}
                                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors cursor-pointer"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* 🏷️ MODAL 2: ADD / EDIT ADDRESS MODAL */}
            {/* ========================================================================= */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-2xl bg-[#141414] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto border border-white/10">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161616]">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Icon icon={editingAddress ? "solar:pen-bold-duotone" : "solar:map-point-wave-bold-duotone"} className="size-5 text-[#D4AF37]" />
                                {editingAddress ? 'Edit Delivery Address' : 'Add Delivery Address'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsAddressModalOpen(false)}
                                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <Icon icon="solar:close-circle-bold" className="size-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveAddress} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* LEFT COLUMN */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">Recipient Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            placeholder="Enter recipient's full name"
                                            className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">Contact Phone Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="e.g. 01712345678"
                                            className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">House No / Road / Street *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.street}
                                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                            placeholder="Building / House / Street Address"
                                            className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">Landmark / Suburb (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.landmark}
                                            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                            placeholder="e.g. Near City Bank / Sector 4"
                                            className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                                        />
                                    </div>
                                </div>

                                {/* RIGHT COLUMN */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">Division / Region *</label>
                                        <div className="relative">
                                            <select
                                                value={formData.division}
                                                onChange={(e) => handleDivisionChange(e.target.value)}
                                                className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
                                            >
                                                {BANGLADESH_DIVISIONS.map((div) => (
                                                    <option key={div} value={div} className="bg-[#1a1a1a] text-white">{div}</option>
                                                ))}
                                            </select>
                                            <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">District / City *</label>
                                        <div className="relative">
                                            <select
                                                value={formData.district}
                                                onChange={(e) => handleDistrictChange(e.target.value)}
                                                className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
                                            >
                                                {availableDistricts.map((dist) => (
                                                    <option key={dist} value={dist} className="bg-[#1a1a1a] text-white">{dist}</option>
                                                ))}
                                            </select>
                                            <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">Thana / Area *</label>
                                        <div className="relative">
                                            <select
                                                value={formData.thana}
                                                onChange={(e) => setFormData({ ...formData, thana: e.target.value })}
                                                className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
                                            >
                                                {availableThanas.map((th) => (
                                                    <option key={th} value={th} className="bg-[#1a1a1a] text-white">{th}</option>
                                                ))}
                                            </select>
                                            <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-300">Additional Instructions (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="e.g. Flat 4B, Floor 4"
                                            className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Label Selection */}
                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-semibold text-gray-300">Address Category:</label>
                                <div className="flex items-center gap-3">
                                    {['Home', 'Office', 'Studio'].map((lbl) => (
                                        <button
                                            key={lbl}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, label: lbl })}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                                                formData.label === lbl
                                                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10'
                                                    : 'border-white/10 text-gray-400 hover:border-white/25 bg-[#1A1A1A]'
                                            }`}
                                        >
                                            <Icon icon={lbl === 'Office' ? 'solar:case-bold' : lbl === 'Studio' ? 'solar:palette-bold' : 'solar:home-smile-bold'} className="size-4" />
                                            {lbl.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-300 select-none">
                                    <input
                                        type="checkbox"
                                        checked={formData.isDefault}
                                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                        className="size-4 rounded border-white/20 text-[#D4AF37] cursor-pointer accent-[#D4AF37]"
                                    />
                                    <span>Set as my default delivery address</span>
                                </label>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    isLoading={isSubmittingAddress}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer"
                                >
                                    Save Address
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyNowPage;