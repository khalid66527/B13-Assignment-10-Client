'use client';
import React from 'react';
import Link from 'next/link';

const ArtCard = ({ art }) => {
  return (
    <div className="group relative bg-gradient-to-b from-[#161616] to-[#0A0A0A] rounded-[24px] overflow-hidden border border-white/5 hover:border-[#D4AF37]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(212,175,55,0.25)] flex flex-col h-full">
      
      {/* ইমেইজ এবং টপ ব্যাজ সেকশন */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#000]">
        
        {/* আর্টওয়ার্ক ইমেইজ */}
        {art.image ? (
          <img
            src={art.image}
            alt={art.title || 'Artwork'}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm font-serif italic">
            Artwork Unavailable
          </div>
        )}

        {/* উপরে বামে: ক্যাটাগরি পিল (Glassmorphism) */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/5 backdrop-blur-md border border-white/10 text-white/90 text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full shadow-lg">
            {art.category || 'Collection'}
          </span>
        </div>

        {/* উপরে ডানে: প্রাইস ট্যাগ (Gold Glassmorphism) */}
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-black/40 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-extrabold px-4 py-1.5 rounded-full shadow-lg">
            ${art.price || '0.00'}
          </span>
        </div>

        {/* হোভার ওভারলে এবং ভিউ ডিটেইল বাটন */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-20">
          <Link href={`/shop/${art._id || art.id}`}>
            <button className="transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 bg-[#D4AF37] hover:bg-[#AA7C11] text-black font-extrabold tracking-wide py-3 px-8 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105">
              View Masterpiece
            </button>
          </Link>
        </div>
        
        {/* স্মুথ শ্যাডো গ্রেডিয়েন্ট (ইমেইজ এবং টেক্সটের মাঝখানে ব্লেন্ডিংয়ের জন্য) */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* কার্ড ইনফো সেকশন */}
      <div className="relative z-20 px-6 pb-6 pt-2 flex flex-col justify-end bg-[#0A0A0A]">
        {/* ডাইনামিক গোল্ড লাইন */}
        <div className="w-8 h-[2px] bg-[#D4AF37] mb-4 opacity-70 group-hover:w-16 transition-all duration-500 ease-out"></div>
        
        {/* টাইটেল */}
        <h3 className="text-xl font-serif font-bold text-gray-100 group-hover:text-[#D4AF37] transition-colors duration-300 truncate">
          {art.title || 'Untitled Artwork'}
        </h3>
        
        {/* অতিরিক্ত ইনফো (যেমন সাইজ বা ক্রিয়েশন ইয়ার) */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            Original Piece
          </p>
          <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500 text-[#D4AF37]">
            →
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ArtCard;