import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { getArtById } from '@/lib/api/arts';
import { buynowStore } from '@/lib/actions/buynow';
import { createPurchase } from '@/lib/actions/purchase';
import { clearUserCartApi } from '@/lib/api/cart';

export default async function CartPurchaseSuccess({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);
  const { status, metadata, amount_total } = session;

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    let purchasedItems = [];

    try {
      if (metadata?.cartData) {
        purchasedItems = JSON.parse(metadata.cartData);
      }
    } catch (e) {
      console.error("Error parsing cartData metadata:", e);
    }

    // Process each item and record purchases in database
    if (Array.isArray(purchasedItems) && purchasedItems.length > 0) {
      for (const item of purchasedItems) {
        try {
          const artwork = await getArtById(item.id);

          const artPayload = {
            id: item.id,
            title: artwork?.title || item.title,
            category: artwork?.category || item.category,
            price: artwork?.price || item.price,
            dimensions: artwork?.dimensions || "",
            date: artwork?.date || "",
            image: artwork?.image || item.image,
            description: artwork?.description || "",
            companyName: artwork?.companyName || item.companyName,
            companyId: artwork?.companyId || item.companyId,
            buynowerName: metadata.userName,
            buynowerEmail: metadata.userEmail,
            buynowerId: metadata.userId,
          };
          await buynowStore(artPayload);

          const purchasePayload = {
            userName: metadata.userName,
            userEmail: metadata.userEmail,
            artistEmail: artwork?.artistEmail || item.artistEmail,
            artistName: artwork?.artistName || item.artistName,
            companyName: artwork?.companyName || item.companyName,
            price: Number(item.price || artwork?.price || 0),
          };
          await createPurchase(purchasePayload);
        } catch (err) {
          console.error("Error processing purchased item:", err);
        }
      }

      // Automatically clear user's cart in database
      if (metadata.userEmail || metadata.userId) {
        try {
          await clearUserCartApi(metadata.userEmail, metadata.userId);
        } catch (err) {
          console.error("Error clearing user cart after checkout:", err);
        }
      }
    }

    const totalPaidFormatted = (Number(amount_total || 0) / 100).toFixed(2);

    return (
      <main className="min-h-screen bg-[#0A0A0A] text-gray-300 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-lg w-full relative overflow-hidden bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-[#D4AF37]/20 rounded-[2.5rem] p-8 sm:p-10 text-center shadow-[0_0_80px_rgba(0,0,0,0.9)]">
          
          {/* Top Gold Glowing Accent */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          
          {/* Animated Success Check Icon */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.2)]">
            <Icon icon="solar:check-circle-bold-duotone" className="size-12" />
          </div>
          
          {/* Headings */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-400 text-sm font-medium mb-6">
            Your collection of {purchasedItems.length} {purchasedItems.length === 1 ? "masterpiece" : "masterpieces"} has been acquired!
          </p>

          {/* Amount Paid Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl mb-6">
            <span className="text-xs text-gray-400">Total Paid:</span>
            <span className="text-base font-black text-[#D4AF37]">${totalPaidFormatted} USD</span>
          </div>

          {/* Purchased Items List */}
          {purchasedItems.length > 0 && (
            <div className="text-left bg-[#111111]/80 border border-white/5 rounded-2xl p-4 mb-6 space-y-3 max-h-48 overflow-y-auto divide-y divide-white/5">
              {purchasedItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 pt-2.5 first:pt-0">
                  <img
                    src={item.image || "https://placehold.co/100"}
                    alt={item.title || "Art"}
                    className="size-11 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-white truncate">{item.title || "Artwork"}</h4>
                    <p className="text-[10px] text-gray-400 truncate">by {item.artistName || "Artist"}</p>
                  </div>
                  <span className="text-xs font-black text-[#FFE58F]">${Number(item.price || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Confirmation Details Box */}
          <div className="space-y-3 text-left bg-[#111111]/60 border border-white/5 rounded-2xl p-4 text-xs leading-relaxed text-gray-400 mb-8">
            <p className="flex items-start gap-2.5">
              <Icon icon="solar:letter-opened-bold" className="text-[#D4AF37] size-4 shrink-0 mt-0.5" />
              <span>
                An official invoice & digital certificates have been sent to <strong className="text-white font-semibold break-all">{metadata.userEmail}</strong>.
              </span>
            </p>
            {metadata.shippingAddress && (
              <p className="flex items-start gap-2.5 pt-2 border-t border-white/5">
                <Icon icon="solar:map-point-wave-bold" className="text-[#D4AF37] size-4 shrink-0 mt-0.5" />
                <span>
                  Delivery Address: <strong className="text-gray-200">{metadata.shippingAddress}</strong>
                </span>
              </p>
            )}
          </div>

          {/* Navigation Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link 
              href="/dashboard/user/bought-arts"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide py-3.5 rounded-xl transition-all text-xs shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
            >
              <Icon icon="solar:palette-round-bold" className="size-4" />
              My Collection
            </Link>
            <Link 
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 font-bold py-3.5 rounded-xl transition-all text-xs"
            >
              <Icon icon="solar:shop-bold" className="size-4 text-[#D4AF37]" />
              Continue Shopping
            </Link>
          </div>

        </div>
      </main>
    );
  }
}
