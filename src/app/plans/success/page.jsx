
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { email } from 'better-auth';
import { createSubscription } from '@/lib/actions/subscription';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)');

  const {
    status,
    customer_details: { email: customerEmail },
    metadata
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {

    const subsInfo ={
        email: customerEmail,
        planId: metadata.planId,
    }

    const result = await createSubscription(subsInfo)
    console.log(result);



    return (
      <main className="min-h-screen bg-[#0A0A0A] text-gray-300 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full relative overflow-hidden bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-8 text-center shadow-2xl">
          
          {/* 🌟 টপ সাকসেস গ্লো লাইন */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
          
          {/* 🎉 অ্যানিমেটেড সাকসেস চেক আইকন */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <Icon icon="solar:check-circle-bold-duotone" className="size-12" />
          </div>
          
          {/* 📝 হেডিংস */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-400 text-sm font-medium mb-6">
            We appreciate your business & art collection!
          </p>

          <div className="h-[1px] bg-white/5 my-6"></div>

          {/* ✉️ ইনফরমেশন বক্স */}
          <div className="space-y-4 text-left bg-[#111111]/60 border border-white/5 rounded-2xl p-4 text-xs md:text-sm leading-relaxed text-gray-400">
            <p className="flex items-start gap-2.5">
              <Icon icon="solar:letter-opened-bold" className="text-emerald-400 size-5 shrink-0 mt-0.5" />
              <span>
                A confirmation email will be sent to <strong className="text-white font-semibold break-all">{customerEmail}</strong> shortly.
              </span>
            </p>
            <p className="flex items-start gap-2.5 pt-2 border-t border-white/5">
              <Icon icon="solar:help-household-bold" className="text-[#D4AF37] size-5 shrink-0 mt-0.5" />
              <span>
                If you have any questions, please email us at{' '}
                <a href="mailto:orders@example.com" className="text-[#FFE58F] font-bold underline underline-offset-4 hover:text-[#D4AF37] transition-colors">
                  orders@example.com
                </a>.
              </span>
            </p>
          </div>

          {/* 🔘 ব্যাক টু হোম বা ড্যাশবোর্ড বাটন */}
          <div className="mt-8">
            <Link 
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide py-3.5 rounded-xl transition-all text-sm shadow-[0_4px_20px_rgba(212,175,55,0.15)]"
            >
              <Icon icon="solar:home-smile-angle-bold" className="size-5" />
              Back to Home
            </Link>
          </div>

        </div>
      </main>
    );
  }
}