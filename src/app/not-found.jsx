import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-gray-300 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full relative overflow-hidden bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-[#D4AF37]/10 rounded-[2rem] p-8 text-center shadow-2xl">
        
        {/* ✨ টপ গোল্ডেন গ্লো লাইন */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
        
        {/* 🧩 গোল্ডেন আইকন কন্টেইনার */}
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-[#D4AF37]">
          <Icon icon="solar:compass-square-bold-duotone" className="size-6" />
        </div>
        
        {/* 🏷️ গোল্ডেন ব্যাজ */}
        <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-[#D4AF37]/10 text-[#FFE58F] border border-[#D4AF37]/20 mb-3">
          Error 404
        </span>
        
        {/* 📝 টেক্সট সেকশন */}
        <h1 className="text-xl font-extrabold tracking-tight text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed mb-6">
          The masterpiece you are looking for doesnot exist, or has been moved to another gallery. Let`s get you back.
        </p>

        {/* 🔘 প্রিমিয়াম গোল্ডেন বাটন */}
        <div className="flex justify-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide px-6 py-3 rounded-xl transition-all text-xs shadow-lg"
          >
            <Icon icon="solar:arrow-left-linear" className="size-4 stroke-[3px]" />
            Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}