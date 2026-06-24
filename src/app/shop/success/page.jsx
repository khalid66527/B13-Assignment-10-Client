import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { getArtById } from '@/lib/api/arts';
import { buynowStore } from '@/lib/actions/buynow';
import { createPurchase } from '@/lib/actions/purchase';

export default async function PurchaseSuccess({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);
  const { status, metadata } = session;

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    // 1. Fetch artwork details from the database to ensure we get absolute correct full details
    const artwork = await getArtById(metadata.artId);

    if (artwork) {
      // 2. Call buynowStore to record the purchase in the user's limit tracking collection (buynowerstor)
      const artPayload = {
        id: metadata.artId,
        title: artwork.title,
        category: artwork.category,
        price: artwork.price,
        dimensions: artwork.dimensions,
        date: artwork.date,
        image: artwork.image,
        description: artwork.description,
        companyName: artwork.companyName,
        companyId: artwork.companyId,
        buynowerName: metadata.userName,
        buynowerEmail: metadata.userEmail,
        buynowerId: metadata.userId,
      };
      await buynowStore(artPayload);

      // 3. Call createPurchase to store the purchase in the permanent purchasestor collection
      const purchasePayload = {
        userName: metadata.userName,
        userEmail: metadata.userEmail,
        artistEmail: metadata.artistEmail || artwork.artistEmail,
        artistName: metadata.artistName || artwork.artistName,
        companyName: metadata.companyName || artwork.companyName,
        price: Number(metadata.price || artwork.price),
      };
      await createPurchase(purchasePayload);
    }

    return (
      <main className="min-h-screen bg-[#0A0A0A] text-gray-300 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full relative overflow-hidden bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-8 text-center shadow-2xl">
          
          {/* 🌟 টপ সাকসেস গ্লো লাইন */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent"></div>
          
          {/* 🎉 অ্যানিমেটেড সাকসেস চেক আইকন */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            <Icon icon="solar:check-circle-bold-duotone" className="size-12" />
          </div>
          
          {/* 📝 হেডিংস */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
            Purchase Successful!
          </h1>
          <p className="text-gray-400 text-sm font-medium mb-6">
            Thank you for purchasing this beautiful artwork!
          </p>

          <div className="h-[1px] bg-white/5 my-6"></div>

          {/* ✉️ ইনফরমেশন বক্স */}
          <div className="space-y-4 text-left bg-[#111111]/60 border border-white/5 rounded-2xl p-4 text-xs md:text-sm leading-relaxed text-gray-400">
            {artwork && (
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
                <img 
                  src={artwork.image || "https://placehold.co/150"} 
                  alt={artwork.title} 
                  className="size-12 rounded-lg object-cover border border-white/5"
                />
                <div>
                  <h4 className="font-bold text-white line-clamp-1">{artwork.title}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">{artwork.category}</p>
                </div>
              </div>
            )}
            
            <p className="flex items-start gap-2.5">
              <Icon icon="solar:letter-opened-bold" className="text-[#D4AF37] size-5 shrink-0 mt-0.5" />
              <span>
                A receipt and digital certificate of authenticity will be sent to <strong className="text-white font-semibold break-all">{metadata.userEmail}</strong> shortly.
              </span>
            </p>
            <p className="flex items-start gap-2.5 pt-2 border-t border-white/5">
              <Icon icon="solar:help-household-bold" className="text-[#D4AF37] size-5 shrink-0 mt-0.5" />
              <span>
                If you have any questions, please email us at{' '}
                <a href="mailto:support@artistry.com" className="text-[#FFE58F] font-bold underline underline-offset-4 hover:text-[#D4AF37] transition-colors">
                  support@artistry.com
                </a>.
              </span>
            </p>
          </div>

          {/* 🔘 ব্যাক টু হোম বাটন */}
          <div className="mt-8">
            <Link 
              href="/shop"
              className="inline-flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide py-3.5 rounded-xl transition-all text-sm shadow-[0_4px_20px_rgba(212,175,55,0.15)]"
            >
              <Icon icon="solar:shop-bold" className="size-5" />
              Continue Shopping
            </Link>
          </div>

        </div>
      </main>
    );
  }
}
