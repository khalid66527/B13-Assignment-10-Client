import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

const UnauthorizedPage = () => {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-gray-300 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full relative overflow-hidden bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-white/5 rounded-[2.5rem] p-8 text-center shadow-2xl">
        
        {/* 🚨 টপ ওয়ার্নিং গ্লো লাইন */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent"></div>
        
        {/* 🔒 অ্যানিমেটেড লক/রিলিজ আইকন */}
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-red-500/20 bg-red-500/5 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <Icon icon="solar:shield-warning-bold-duotone" className="size-12" />
        </div>
        
        {/* 📝 টেক্সট মেসেজ */}
        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
          Error 401 : Unauthorized
        </span>
        
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-4 mb-2">
          Access Denied
        </h1>
        
        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto mb-8">
          You do not have permission to view this page. Please sign in with an authorized account or return to the safety of home.
        </p>

        <div className="h-[1px] bg-white/5 my-6"></div>

        {/* 🔘 অ্যাকশন বাটন গ্রুপ */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all text-xs border border-white/5"
          >
            <Icon icon="solar:home-angle-bold" className="size-4" />
            Go Home
          </Link>
          
          <Link 
            href="/auth/signin"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide py-3 rounded-xl transition-all text-xs shadow-lg"
          >
            <Icon icon="solar:login-2-bold" className="size-4" />
            Login Again
          </Link>
        </div>

      </div>
    </main>
  );
};

export default UnauthorizedPage;