"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { getUserCart, addToCartApi, updateCartQtyApi, removeCartItemApi, clearUserCartApi } from "@/lib/api/cart";

import { Icon } from "@iconify/react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastData, setToastData] = useState(null);

  // Show floating toast alert for 4.5 seconds
  const showToast = (art, message = "Added to Cart!") => {
    setToastData({
      title: art?.title || "Artwork",
      image: art?.image || "",
      price: art?.price || 0,
      message,
    });
    setTimeout(() => {
      setToastData(null);
    }, 4500);
  };

  // Fetch cart items from MongoDB
  const fetchCart = useCallback(async () => {
    if (!user) {
      try {
        const local = localStorage.getItem("arthall_local_cart");
        if (local) {
          setCartItems(JSON.parse(local));
        } else {
          setCartItems([]);
        }
      } catch (e) {
        setCartItems([]);
      }
      return;
    }

    setLoading(true);
    try {
      const items = await getUserCart(user.email, user.id);
      if (Array.isArray(items)) {
        setCartItems(items);
      }
    } catch (err) {
      console.error("Failed to load cart items:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load cart when user session resolves
  useEffect(() => {
    if (!isPending) {
      fetchCart();
    }
  }, [user, isPending, fetchCart]);

  // 1. Add Artwork to Cart (DOES NOT auto-open drawer, only shows alert)
  const addToCart = async (art, qty = 1) => {
    if (!art) return;

    const artId = art._id || art.id || art.artworkId || art.artId;
    const itemData = {
      artworkId: artId,
      artId: artId,
      title: art.title || "Untitled Artwork",
      price: Number(art.price) || 0,
      image: art.image || "",
      category: art.category || "Fine Art",
      dimensions: art.dimensions || "",
      companyName: art.companyName || "",
      companyId: art.companyId || "",
      artistName: art.artistName || "Artist",
      artistEmail: art.artistEmail || "",
      quantity: Number(qty) || 1,
      userEmail: user?.email || "",
      email: user?.email || "",
      userId: user?.id || "",
    };

    // Optimistic UI update
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => String(i.artworkId || i.artId || i.id || i._id) === String(artId)
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (Number(updated[existingIndex].quantity) || 1) + Number(qty),
        };
        return updated;
      }
      return [{ ...itemData, _id: "temp-" + Date.now() }, ...prev];
    });

    // Show floating Alert without opening drawer
    showToast(art, "Added to your Cart!");

    // Sync to backend if logged in
    if (user) {
      try {
        const res = await addToCartApi(itemData);
        if (res && res.success) {
          fetchCart();
        }
      } catch (err) {
        console.error("Error saving cart to database:", err);
      }
    } else {
      try {
        const updated = [...cartItems, itemData];
        localStorage.setItem("arthall_local_cart", JSON.stringify(updated));
      } catch (e) {}
    }
  };

  // 2. Remove Artwork from Cart
  const removeFromCart = async (cartItemId, artworkId) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          String(item._id) !== String(cartItemId) &&
          String(item.artworkId || item.artId || item.id) !== String(artworkId)
      )
    );

    if (user && cartItemId && !String(cartItemId).startsWith("temp-")) {
      try {
        await removeCartItemApi(cartItemId);
      } catch (err) {
        console.error("Error removing item from server cart:", err);
      }
    } else if (!user) {
      try {
        const filtered = cartItems.filter((i) => String(i._id) !== String(cartItemId));
        localStorage.setItem("arthall_local_cart", JSON.stringify(filtered));
      } catch (e) {}
    }
  };

  // 3. Update Quantity
  const updateQuantity = async (cartItemId, newQty) => {
    const qty = Math.max(1, Number(newQty) || 1);

    setCartItems((prev) =>
      prev.map((item) =>
        String(item._id) === String(cartItemId) ? { ...item, quantity: qty } : item
      )
    );

    if (user && cartItemId && !String(cartItemId).startsWith("temp-")) {
      try {
        await updateCartQtyApi(cartItemId, qty);
      } catch (err) {
        console.error("Error updating quantity on server:", err);
      }
    }
  };

  // 4. Clear Cart
  const clearCart = async () => {
    setCartItems([]);

    if (user) {
      try {
        await clearUserCartApi(user.email, user.id);
      } catch (err) {
        console.error("Error clearing cart on server:", err);
      }
    } else {
      try {
        localStorage.removeItem("arthall_local_cart");
      } catch (e) {}
    }
  };

  // Calculated properties
  const cartCount = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const openCart = () => {
    setIsDrawerOpen(true);
    fetchCart();
  };

  const closeCart = () => {
    setIsDrawerOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        isDrawerOpen,
        setIsDrawerOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        loading,
        showToast,
      }}
    >
      {children}

      {/* --- FLOATING TOAST ALERT (Top Right) --- */}
      {toastData && (
        <div className="fixed top-24 right-4 sm:right-8 z-[99999] animate-bounce-short">
          <div className="bg-[#161616]/95 border border-[#D4AF37]/50 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl rounded-2xl p-4 flex items-center gap-3.5 max-w-sm">
            {/* Thumbnail */}
            {toastData.image ? (
              <img
                src={toastData.image}
                alt={toastData.title}
                className="size-12 rounded-xl object-cover border border-[#D4AF37]/30 shrink-0"
              />
            ) : (
              <div className="size-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center shrink-0">
                <Icon icon="solar:check-circle-bold" className="size-6" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-[#FFE58F] font-bold">
                <Icon icon="solar:check-circle-bold" className="size-3.5 text-[#D4AF37]" />
                <span>{toastData.message}</span>
              </div>
              <p className="text-xs font-semibold text-white truncate mt-0.5">
                {toastData.title}
              </p>
            </div>

            {/* View Cart Button */}
            <button
              onClick={() => {
                setToastData(null);
                openCart();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#AA7C11] text-black font-extrabold text-[11px] shrink-0 transition-colors shadow cursor-pointer"
            >
              View Cart
            </button>

            {/* Close Button */}
            <button
              onClick={() => setToastData(null)}
              className="text-gray-400 hover:text-white p-1 transition-colors"
            >
              <Icon icon="solar:close-circle-bold" className="size-4" />
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
