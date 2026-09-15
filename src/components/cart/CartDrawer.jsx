"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { useCart } from "@/lib/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { getUserAddresses } from "@/lib/api/address";

export default function CartDrawer() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const {
    cartItems,
    cartCount,
    subtotal,
    isDrawerOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toastMessage,
  } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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

  // Fetch addresses when drawer opens or user changes
  useEffect(() => {
    if (isDrawerOpen && user?.email) {
      setLoadingAddresses(true);
      getUserAddresses(user.email, user.id)
        .then((data) => {
          setAddresses(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error("Error fetching user addresses in drawer:", err);
        })
        .finally(() => {
          setLoadingAddresses(false);
        });
    }
  }, [isDrawerOpen, user?.email, user?.id]);

  if (!isDrawerOpen) return null;

  const selectedAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;

  const handleCheckoutSubmit = async (e) => {
    if (!user) {
      e.preventDefault();
      closeCart();
      router.push("/auth/signin?redirect=/dashboard/user/cart");
      return;
    }

    if (cartItems.length === 0) {
      e.preventDefault();
      return;
    }

    // Check if user has an address
    if (addresses.length === 0) {
      e.preventDefault();
      closeCart();
      router.push("/dashboard/user/cart?requireAddress=true");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F0F0F] border-l border-[#D4AF37]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col transform transition-transform ease-out duration-300">
          
          {/* --- TOP HEADER --- */}
          <div className="p-6 border-b border-white/5 bg-[#141414] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                <Icon icon="solar:cart-large-4-bold-duotone" className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Shopping Cart
                  <span className="text-xs bg-[#D4AF37]/20 text-[#FFE58F] font-extrabold px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </span>
                </h2>
                <p className="text-xs text-gray-400">Review selected artworks</p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="size-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <Icon icon="solar:close-circle-bold" className="size-5" />
            </button>
          </div>

          {/* --- TOAST ALERT --- */}
          {toastMessage && (
            <div className="px-6 pt-3 pb-0">
              <div className="flex items-center gap-2 text-xs py-2 px-3 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#FFE58F] animate-fadeUp">
                <Icon icon="solar:check-circle-bold" className="size-4 shrink-0 text-[#D4AF37]" />
                <span className="truncate">{toastMessage.message}</span>
              </div>
            </div>
          )}

          {/* --- CART ITEMS LIST --- */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-white/5">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="size-20 rounded-full bg-[#181818] border border-white/5 flex items-center justify-center text-gray-600 mb-4 shadow-inner">
                  <Icon icon="solar:bag-smile-linear" className="size-10 text-gray-500" />
                </div>
                <h3 className="text-base font-bold text-gray-200 mb-1">Your cart is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Discover rare digital and physical masterworks from top global creators.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md"
                >
                  <Icon icon="solar:gallery-bold" className="size-4" />
                  Explore Art Gallery
                </Link>
              </div>
            ) : (
              cartItems.map((item, idx) => {
                const itemKey = item._id || item.id || item.artworkId || idx;
                const itemPrice = Number(item.price) || 0;
                const itemQty = Number(item.quantity) || 1;
                const artId = item.artworkId || item.artId || item.id || item._id;

                return (
                  <div key={itemKey} className="pt-4 first:pt-0 flex gap-4 group">
                    {/* Artwork Thumbnail */}
                    <div className="relative size-20 rounded-xl overflow-hidden bg-[#181818] border border-white/5 shrink-0 group-hover:border-[#D4AF37]/30 transition-all">
                      <img
                        src={item.image || "https://placehold.co/150"}
                        alt={item.title || "Artwork"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Artwork Info & Controls */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/shop/${artId}`}
                            onClick={closeCart}
                            className="font-bold text-sm text-white hover:text-[#D4AF37] transition-colors truncate"
                          >
                            {item.title || "Untitled Art"}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item._id, artId)}
                            className="text-gray-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                            title="Remove artwork"
                          >
                            <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">
                          by <span className="text-gray-300 font-medium">{item.artistName || "Artist"}</span>
                        </p>
                        {item.category && (
                          <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 pt-2">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-white/10 rounded-lg bg-[#141414] overflow-hidden">
                          <button
                            onClick={() => {
                              if (itemQty > 1) {
                                updateQuantity(item._id, itemQty - 1);
                              } else {
                                removeFromCart(item._id, artId);
                              }
                            }}
                            className="size-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                            {itemQty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, itemQty + 1)}
                            className="size-6 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-sm font-black text-[#D4AF37]">
                            ${(itemPrice * itemQty).toFixed(2)}
                          </span>
                          {itemQty > 1 && (
                            <p className="text-[10px] text-gray-500">${itemPrice} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* --- FOOTER SUMMARY & CHECKOUT --- */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/5 bg-[#141414] space-y-4">
              {/* Delivery Address Indicator in Drawer */}
              <div className="px-3 py-2 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Icon icon="solar:map-point-wave-bold-duotone" className="size-4 text-[#D4AF37] shrink-0" />
                  {selectedAddress ? (
                    <span className="text-gray-300 truncate">
                      Deliver to: <strong className="text-white">{selectedAddress.fullName}</strong> ({selectedAddress.district || selectedAddress.city})
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold truncate flex items-center gap-1">
                      <Icon icon="solar:danger-circle-bold" className="size-3.5" />
                      No delivery address set
                    </span>
                  )}
                </div>
                <Link
                  href="/dashboard/user/addresses"
                  onClick={closeCart}
                  className="text-[11px] text-[#D4AF37] hover:underline font-semibold shrink-0 ml-2"
                >
                  {selectedAddress ? "Change" : "Add Address"}
                </Link>
              </div>

              {/* Summary details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping & Delivery</span>
                  <span className="text-[#FFE58F] font-bold">Free Insured Courier</span>
                </div>
                <div className="h-[1px] bg-white/5 pt-1"></div>
                <div className="flex justify-between items-center text-sm font-bold text-white pt-1">
                  <span>Total Due</span>
                  <span className="text-lg font-black text-[#D4AF37]">${subtotal.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <form 
                  action="/api/checkout_sessions" 
                  method="POST" 
                  onSubmit={handleCheckoutSubmit}
                  className="w-full"
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

                  <button
                    type="submit"
                    disabled={cartItems.length === 0}
                    className={`w-full font-extrabold tracking-wide py-3.5 rounded-xl transition-all shadow-[0_4px_25px_rgba(212,175,55,0.2)] flex items-center justify-center gap-2 text-sm cursor-pointer ${
                      selectedAddress
                        ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black"
                        : "bg-[#2A2415] text-[#FFE58F]/80 border border-[#D4AF37]/30 hover:bg-[#382E19]"
                    }`}
                  >
                    <Icon icon="solar:card-2-bold" className="size-5" />
                    {selectedAddress ? "Proceed to Checkout" : "Set Address & Checkout"}
                  </button>
                </form>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard/user/cart"
                    onClick={closeCart}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/10 hover:border-[#D4AF37]/30 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all"
                  >
                    <Icon icon="solar:widget-2-bold" className="size-4 text-[#D4AF37]" />
                    Dashboard Cart
                  </Link>

                  <button
                    onClick={clearCart}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/5 hover:border-red-500/30 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Icon icon="solar:trash-bin-minimalistic-bold" className="size-4" />
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
                <Icon icon="solar:shield-check-bold" className="size-3.5 text-[#D4AF37]" />
                <span>Encrypted 256-Bit SSL Checkout via Stripe</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
