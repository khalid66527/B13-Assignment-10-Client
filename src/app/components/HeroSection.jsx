"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] bg-[#0A0A0A] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background grids and abstract glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35"></div>
      
      {/* Golden spotlight glows with float animations */}
      <div className="absolute top-12 left-1/4 w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-12 right-1/4 w-[350px] h-[350px] bg-[#AA7C11]/3 rounded-full blur-[120px] pointer-events-none animate-float-delayed"></div>

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        {/* CSS Keyframes & Custom Classes */}
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
            50% { transform: translateY(-30px) scale(1.1); opacity: 1; }
          }
          @keyframes shimmer {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          
          /* Animation utility classes */
          .animate-fadeUp {
            animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0; /* Starts hidden before animation kicks in */
          }
          .animate-float {
            animation: float 7s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float 9s ease-in-out infinite 3s;
          }
          .animate-spin-slow {
            animation: spin 8s linear infinite;
          }
          .animate-shimmer {
            background-size: 200% auto;
            animation: shimmer 5s linear infinite;
          }

          /* Stagger delays */
          .delay-100 { animation-delay: 100ms; }
          .delay-200 { animation-delay: 200ms; }
          .delay-300 { animation-delay: 300ms; }
          .delay-400 { animation-delay: 400ms; }
          .delay-500 { animation-delay: 500ms; }
        `}</style>

        {/* Premium badge */}
        <div className="animate-fadeUp delay-100 inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-300 tracking-wide hover:bg-white/10 transition-colors duration-300 cursor-default">
          <Icon icon="solar:crown-minimalistic-bold" className="text-[#D4AF37] size-4 animate-spin-slow" />
          <span>The Sovereign Art Hall & Marketplace</span>
        </div>

        {/* Heading & description */}
        <div className="space-y-4">
          <h1 className="animate-fadeUp delay-200 text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold text-white tracking-tight leading-[1.1]">
            Where Masterpieces Find <br />
            Their <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#FFE58F] animate-shimmer">Collectors</span>
          </h1>
          <p className="animate-fadeUp delay-300 text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Discover, acquire, and preserve premium physical and digital artworks from the world`s most talented creators. Fully insured logistics and blockchain authentication included.
          </p>
        </div>

        {/* Buttons */}
        <div className="animate-fadeUp delay-400 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold tracking-wide rounded-xl shadow-[0_4px_25px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Icon icon="solar:shop-bold" className="size-5" />
            <span>Go to Shop / Explore Gallery</span>
            <Icon icon="solar:arrow-right-linear" className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
          
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold tracking-wide rounded-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Icon icon="solar:gallery-bold" className="size-5 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
            <span>View Collections</span>
          </Link>
        </div>

        {/* Features list */}
        <div className="animate-fadeUp delay-500 grid grid-cols-3 gap-4 pt-12 border-t border-white/5 max-w-3xl mx-auto text-center">
          <div className="space-y-1 group hover:-translate-y-1 transition-transform duration-300 cursor-default">
            <span className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-[#D4AF37] transition-colors duration-300">100%</span>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Insured Shipping</p>
          </div>
          <div className="space-y-1 border-x border-white/5 group hover:-translate-y-1 transition-transform duration-300 cursor-default">
            <span className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-[#D4AF37] transition-colors duration-300">On-Chain</span>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Provenance Logs</p>
          </div>
          <div className="space-y-1 group hover:-translate-y-1 transition-transform duration-300 cursor-default">
            <span className="text-xl sm:text-2xl font-extrabold text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">Premium</span>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Art Curation</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;