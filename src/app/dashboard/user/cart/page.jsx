"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { useCart } from "@/lib/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { getUserAddresses } from "@/lib/api/address";
import { addUserAddress, updateUserAddress } from "@/lib/actions/address";
import { BANGLADESH_DIVISIONS, BD_DISTRICTS, BD_THANAS } from "@/lib/data/locations";

function UserCartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const {
    cartItems,
    cartCount,
    subtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    loading,
  } = useCart();

  // 📬 Addresses State
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Modals state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);

  // Address Form Data
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    division: "Dhaka",
    district: "Dhaka City",
    thana: "Dhanmondi",
    street: "",
    landmark: "",
    address: "",
    label: "Home",
    isDefault: true,
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  // Re-fetch addresses helper
  const reloadAddresses = async (preferredId = null) => {
    if (!user?.email) return;
    try {
      setLoadingAddresses(true);
      const userAddrs = await getUserAddresses(user?.email, user?.id);
      const list = Array.isArray(userAddrs) ? userAddrs : [];
      setAddresses(list);

      if (preferredId && list.some((a) => a._id === preferredId)) {
        setSelectedAddressId(preferredId);
      } else if (!list.some((a) => a._id === selectedAddressId)) {
        const def = list.find((a) => a.isDefault);
        setSelectedAddressId(def?._id || list[0]?._id || null);
      }
    } catch (err) {
      console.error("Failed to load user addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Fetch addresses on user load
  useEffect(() => {
    if (user?.email) {
      reloadAddresses();
    }
  }, [user?.email, user?.id]);

  // Check URL params for address requirement trigger
  useEffect(() => {
    if (searchParams.get("requireAddress") === "true" || searchParams.get("addressRequired") === "true") {
      showToast("Please add your delivery address to proceed with checkout!", "error");
      handleOpenAddModal();
    }
  }, [searchParams]);

  // Update selected address when addresses change
  useEffect(() => {
    if (addresses.length > 0) {
      const hasSelected = addresses.some((a) => a._id === selectedAddressId);
      if (!hasSelected) {
        const def = addresses.find((a) => a.isDefault);
        setSelectedAddressId(def?._id || addresses[0]?._id || null);
      }
    } else {
      setSelectedAddressId(null);
    }
  }, [addresses]);

  // Active selected address
  const selectedAddress = addresses.find((a) => a._id === selectedAddressId) || addresses[0] || null;

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
      fullName: user?.name || "",
      phone: "",
      division: "Dhaka",
      district: "Dhaka City",
      thana: "Dhanmondi",
      street: "",
      landmark: "",
      address: "",
      label: "Home",
      isDefault: addresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditModal = (addr) => {
    setEditingAddress(addr);
    setFormData({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      division: addr.division || addr.state || "Dhaka",
      district: addr.district || addr.city || "Dhaka City",
      thana: addr.thana || "Dhanmondi",
      street: addr.street || "",
      landmark: addr.landmark || "",
      address: addr.address || addr.street || "",
      label: addr.label || "Home",
      isDefault: addr.isDefault === true,
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.division || !formData.district || !formData.street) {
      showToast("Please fill in Full Name, Phone, Division, City, and Street Address.", "error");
      return;
    }

    try {
      setIsSubmittingAddress(true);
      const payload = {
        ...formData,
        city: formData.district,
        state: formData.division,
        country: "Bangladesh",
        zipCode: "",
        userEmail: user?.email || "",
        userId: user?.id || "",
      };

      let savedAddrId = null;
      if (editingAddress?._id) {
        await updateUserAddress(editingAddress._id, payload);
        savedAddrId = editingAddress._id;
        showToast("Delivery address updated successfully!");
      } else {
        const res = await addUserAddress(payload);
        savedAddrId = res?.insertedId || res?._id || null;
        showToast("Delivery address saved successfully!");
      }

      setIsAddressModalOpen(false);
      await reloadAddresses(savedAddrId);
    } catch (err) {
      console.error("Error saving address:", err);
      showToast("Failed to save address. Please try again.", "error");
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  // Helper to format address string
  const formatAddressString = (addr) => {
    if (!addr) return "";
    const parts = [];
    if (addr.street) parts.push(addr.street);
    if (addr.landmark) parts.push(`(${addr.landmark})`);
    if (addr.thana) parts.push(addr.thana);
    if (addr.district || addr.city) parts.push(addr.district || addr.city);
    if (addr.division || addr.state) parts.push(addr.division || addr.state);
    return parts.join(", ");
  };

  // Handle promo code apply
  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === "ARTHALL10" || code === "WELCOME10") {
      setDiscountPercent(10);
      setPromoMessage({ text: "10% Discount Applied!", success: true });
    } else if (code === "VIP20") {
      setDiscountPercent(20);
      setPromoMessage({ text: "20% VIP Discount Applied!", success: true });
    } else {
      setDiscountPercent(0);
      setPromoMessage({ text: "Invalid promo code", success: false });
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Mandatory Address Check on Form Submission
  const handleCheckoutSubmit = (e) => {
    if (!user) {
      e.preventDefault();
      router.push("/auth/signin?redirect=/dashboard/user/cart");
      return;
    }

    if (cartItems.length === 0) {
      e.preventDefault();
      showToast("Your cart is empty!", "error");
      return;
    }

    if (!selectedAddress || addresses.length === 0) {
      e.preventDefault();
      showToast("Please provide your delivery address before proceeding to checkout!", "error");
      handleOpenAddModal();
    }
  };

  return (
    <div className="space-y-8 animate-fadeUp relative">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border transition-all duration-300 ${
            toast.type === "error"
              ? "bg-[#1c1111] border-red-500/50 text-red-200"
              : "bg-[#161616] border-[#D4AF37]/40 text-white"
          }`}
        >
          <div className={`p-1 rounded-lg ${toast.type === "error" ? "bg-red-500/20 text-red-400" : "bg-[#D4AF37]/15 text-[#D4AF37]"}`}>
            <Icon icon={toast.type === "error" ? "solar:danger-circle-bold" : "solar:check-circle-bold"} className="size-5" />
          </div>
          <div className="text-sm font-semibold tracking-wide">{toast.message}</div>
        </div>
      )}

      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl text-[#D4AF37]">
              <Icon icon="solar:cart-large-4-bold-duotone" className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                My Shopping Cart
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                Manage your selected artworks and complete secure multi-item purchase.
              </p>
            </div>
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={clearCart}
              className="px-4 py-2.5 rounded-xl border border-white/5 hover:border-red-500/30 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
              Clear Cart
            </button>
            <Link
              href="/shop"
              className="px-4 py-2.5 rounded-xl border border-[#D4AF37]/30 hover:border-[#D4AF37] bg-[#D4AF37]/10 text-[#FFE58F] text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Icon icon="solar:shop-bold" className="size-4 text-[#D4AF37]" />
              Browse Gallery
            </Link>
          </div>
        )}
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-2xl">
          <div className="size-24 rounded-3xl bg-[#1A1A1A] border border-white/5 flex items-center justify-center mx-auto text-gray-600 mb-6 shadow-inner">
            <Icon icon="solar:bag-cross-bold-duotone" className="size-12 text-[#D4AF37]/40" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Currently Empty</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            You haven&apos;t added any masterworks to your collection yet. Discover trending original paintings, digital artworks, and fine photography.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-[0_4px_25px_rgba(212,175,55,0.2)] text-sm"
            >
              <Icon icon="solar:gallery-wide-bold" className="size-5" />
              Explore Marketplace
            </Link>
            <Link
              href="/dashboard/user/bought-arts"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 px-6 py-3.5 rounded-xl transition-all text-sm font-semibold"
            >
              <Icon icon="solar:palette-round-bold" className="size-5 text-[#D4AF37]" />
              View Bought Artworks
            </Link>
          </div>
        </div>
      ) : (
        /* Grid Layout: Items on Left (7 cols), Order Summary on Right (5 cols) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: CART ITEMS & DELIVERY ADDRESS --- */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                Artworks ({cartCount})
              </h3>
              <span className="text-xs text-[#D4AF37]">Free Insured Delivery</span>
            </div>

            <div className="space-y-4">
              {cartItems.map((item, index) => {
                const itemKey = item._id || item.id || item.artworkId || index;
                const price = Number(item.price) || 0;
                const qty = Number(item.quantity) || 1;
                const artId = item.artworkId || item.artId || item.id || item._id;

                return (
                  <div
                    key={itemKey}
                    className="bg-[#121212] border border-white/5 hover:border-[#D4AF37]/30 rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-lg group"
                  >
                    {/* Thumbnail */}
                    <div className="relative size-24 rounded-xl overflow-hidden bg-[#181818] border border-white/5 shrink-0">
                      <img
                        src={item.image || "https://placehold.co/200"}
                        alt={item.title || "Artwork"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-sm border border-[#D4AF37]/30 text-[#FFE58F] text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded">
                        {item.category || "Art"}
                      </span>
                    </div>

                    {/* Artwork Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/shop/${artId}`}
                            className="font-bold text-base text-white hover:text-[#D4AF37] transition-colors truncate block"
                          >
                            {item.title || "Untitled Masterpiece"}
                          </Link>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Created by <strong className="text-gray-300 font-semibold">{item.artistName || "Unknown Artist"}</strong>
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id, artId)}
                          className="size-8 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                          title="Remove item"
                        >
                          <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                        </button>
                      </div>

                      {/* Dimensions & Meta */}
                      {item.dimensions && (
                        <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                          <Icon icon="solar:ruler-angular-linear" className="size-3.5 text-[#D4AF37]" />
                          {item.dimensions}
                        </p>
                      )}

                      {/* Quantity Selector & Price in Bottom Row */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Qty:</span>
                          <div className="flex items-center border border-white/10 rounded-lg bg-[#181818] overflow-hidden">
                            <button
                              onClick={() => {
                                if (qty > 1) {
                                  updateQuantity(item._id, qty - 1);
                                } else {
                                  removeFromCart(item._id, artId);
                                }
                              }}
                              className="size-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-bold text-white min-w-[24px] text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, qty + 1)}
                              className="size-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-black text-[#D4AF37]">
                            ${(price * qty).toFixed(2)}
                          </div>
                          {qty > 1 && (
                            <span className="text-[10px] text-gray-500">
                              (${price.toFixed(2)} each)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🏠 DELIVERY ADDRESS SECTION */}
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
                      className="p-1 px-2.5 text-[11px] rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Edit this address"
                    >
                      <Icon icon="solar:pen-linear" className="size-3 text-[#D4AF37]" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenAddModal}
                      className="p-1 px-2.5 text-[11px] rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#FFE58F] border border-[#D4AF37]/30 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Icon icon="solar:add-circle-bold" className="size-3 text-[#D4AF37]" />
                      <span>+ Add New</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Render Saved Address Card OR Prominent Warning Card */}
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
                      Verified Delivery Location (Bangladesh 🇧🇩)
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
                /* ⚠️ NO ADDRESS WARNING & ADD BUTTON */
                <div className="bg-[#1F1212]/90 border border-red-500/30 rounded-2xl p-5 text-center space-y-3">
                  <div className="size-11 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                    <Icon icon="solar:map-point-remove-bold" className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Shipping Address Required</h4>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                      You must add a doorstep delivery address before proceeding to Stripe checkout.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="w-full max-w-xs mx-auto py-3 px-5 rounded-xl text-xs font-black bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Icon icon="solar:add-circle-bold" className="size-4" />
                    Add Delivery Address
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT: ORDER SUMMARY CARD --- */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-[#D4AF37]/20 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
              
              {/* Header */}
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Icon icon="solar:bill-list-bold-duotone" className="size-5 text-[#D4AF37]" />
                  Order Summary
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Summary of {cartCount} items</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-gray-200">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span className="flex items-center gap-1.5">
                    Insured Express Shipping
                    <Icon icon="solar:info-circle-linear" className="size-3.5 text-gray-500" />
                  </span>
                  <span className="text-[#FFE58F] font-bold">Free</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promotional Discount ({discountPercent}%)</span>
                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="h-[1px] bg-white/5 pt-2"></div>

                <div className="flex justify-between items-baseline pt-1">
                  <div>
                    <span className="text-base font-extrabold text-white block">Total Amount</span>
                    <span className="text-[10px] text-gray-500">Includes all taxes & fees</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]">
                      ${finalTotal.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-gray-400 ml-1">USD</span>
                  </div>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={applyPromo} className="pt-2">
                <label className="text-xs text-gray-400 block mb-1.5 font-medium">Have a Promo Code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. ARTHALL10, VIP20"
                    className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    className="bg-white/10 hover:bg-white/15 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] mt-1.5 font-medium ${promoMessage.success ? "text-emerald-400" : "text-red-400"}`}>
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Checkout Form */}
              <form 
                action="/api/checkout_sessions" 
                method="POST" 
                onSubmit={handleCheckoutSubmit}
                className="space-y-3 pt-2"
              >
                <input type="hidden" name="checkout_type" value="cart" />
                <input type="hidden" name="items" value={JSON.stringify(cartItems)} />
                <input type="hidden" name="address_id" value={selectedAddress?._id || ""} />
                <input type="hidden" name="shipping_name" value={selectedAddress?.fullName || user?.name || ""} />
                <input type="hidden" name="shipping_phone" value={selectedAddress?.phone || ""} />
                <input
                  type="hidden"
                  name="shipping_address"
                  value={formatAddressString(selectedAddress)}
                />
                <input type="hidden" name="discount_percent" value={String(discountPercent)} />

                <button
                  type="submit"
                  disabled={cartItems.length === 0}
                  className={`w-full font-extrabold tracking-wide py-4 rounded-2xl transition-all shadow-[0_4px_30px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2.5 text-base cursor-pointer hover:scale-[1.01] ${
                    selectedAddress
                      ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black"
                      : "bg-[#2A2415] text-[#FFE58F]/80 border border-[#D4AF37]/30 hover:bg-[#382E19]"
                  }`}
                >
                  <Icon icon="solar:card-2-bold" className="size-6" />
                  {selectedAddress ? `Pay $${finalTotal.toFixed(2)} with Stripe` : "Add Address & Checkout"}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                  <Icon icon="solar:shield-check-bold" className="size-4 text-[#D4AF37]" />
                  <span>Guaranteed Safe & Secure Checkout with Stripe</span>
                </div>
              </form>

              {/* Value Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5 text-center text-[10px] text-gray-400">
                <div className="p-2 rounded-xl bg-white/5">
                  <Icon icon="solar:verified-check-bold" className="size-4 text-[#D4AF37] mx-auto mb-1" />
                  <span>100% Authentic</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <Icon icon="solar:box-minimalistic-bold" className="size-4 text-[#D4AF37] mx-auto mb-1" />
                  <span>Museum Packaging</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <Icon icon="solar:refresh-circle-bold" className="size-4 text-[#D4AF37] mx-auto mb-1" />
                  <span>Buyer Protected</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🏷️ MODAL 1: SELECT / SWITCH SAVED ADDRESS */}
      {/* ========================================================================= */}
      {isSelectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
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
                      showToast("Delivery address selected!");
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-[#1D1B13] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                        : "bg-[#181818] border-white/5 hover:border-white/20"
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
                        isSelected ? "border-[#D4AF37] bg-[#D4AF37] text-black" : "border-white/30"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#141414] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto border border-white/10">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161616]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Icon icon={editingAddress ? "solar:pen-bold-duotone" : "solar:map-point-wave-bold-duotone"} className="size-5 text-[#D4AF37]" />
                {editingAddress ? "Edit Delivery Address" : "Add Delivery Address"}
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
                      placeholder="Nearby landmark or area note"
                      className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Region / Division *</label>
                    <div className="relative">
                      <select
                        value={formData.division}
                        onChange={(e) => handleDivisionChange(e.target.value)}
                        className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
                      >
                        {BANGLADESH_DIVISIONS.map((div) => (
                          <option key={div} value={div} className="bg-[#1a1a1a] text-white">
                            {div}
                          </option>
                        ))}
                      </select>
                      <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">City / District *</label>
                    <div className="relative">
                      <select
                        value={formData.district}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
                      >
                        {availableDistricts.map((dist) => (
                          <option key={dist} value={dist} className="bg-[#1a1a1a] text-white">
                            {dist}
                          </option>
                        ))}
                      </select>
                      <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Area / Thana *</label>
                    <div className="relative">
                      <select
                        value={formData.thana}
                        onChange={(e) => setFormData({ ...formData, thana: e.target.value })}
                        className="w-full appearance-none bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 cursor-pointer pr-10"
                      >
                        {availableThanas.map((th) => (
                          <option key={th} value={th} className="bg-[#1a1a1a] text-white">
                            {th}
                          </option>
                        ))}
                      </select>
                      <Icon icon="solar:alt-arrow-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Detailed Address (Flat / Floor)</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Flat 4B, Level 3"
                      className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30"
                    />
                  </div>
                </div>
              </div>

              {/* Label Selection */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-gray-300">Address Category Label:</label>
                <div className="flex items-center gap-3">
                  {["Home", "Office", "Studio"].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setFormData({ ...formData, label: lbl })}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                        formData.label === lbl
                          ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10"
                          : "border-white/15 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <Icon icon={lbl === "Office" ? "solar:case-bold" : lbl === "Studio" ? "solar:palette-bold" : "solar:home-smile-bold"} className="size-4" />
                      {lbl.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 select-none">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded border-white/20 text-[#D4AF37] cursor-pointer"
                  />
                  <span>Set as default shipping address</span>
                </label>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <Button
                  type="submit"
                  isLoading={isSubmittingAddress}
                  className="px-8 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49d2f] text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer"
                >
                  {editingAddress ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserCartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center text-[#D4AF37]">
        <Icon icon="eos-icons:loading" className="size-8 animate-spin" />
      </div>
    }>
      <UserCartContent />
    </Suspense>
  );
}
