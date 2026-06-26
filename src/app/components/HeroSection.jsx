"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

const HeroSection = () => {
  // Create an array of image URLs from herobanner (1).jpg to (14).jpg
  const bannerImages = Array.from({ length: 14 }, (_, i) => `/image/herobanner (${i + 1}).jpg`);
  
  // Duplicate the list for seamless infinite marquee effect
  const marqueeImages = [...bannerImages, ...bannerImages];

  return (
    <section className="relative min-h-[100vh] bg-[#050505] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 font-sans">
      {/* Background grids and abstract glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
      
      {/* Golden spotlight glows with float animations */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-[#AA7C11]/10 rounded-full blur-[150px] pointer-events-none animate-float-delayed"></div>

      {/* Decorative Corner Diya/Lamps with flickering flames */}
      {/* Top Left Diya */}
      <div className="absolute top-12 left-6 opacity-30 pointer-events-none hidden md:block select-none animate-float">
        <svg viewBox="0 0 200 150" className="w-36 h-auto drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">
          <path d="M 30,70 Q 100,140 170,70 Q 160,60 150,65 Q 100,85 50,65 Q 40,60 30,70" fill="url(#clayGrad)" stroke="#6B4E12" strokeWidth="2" />
          <path d="M 55,75 Q 100,95 145,75" fill="none" stroke="#FFE58F" strokeWidth="1" strokeDasharray="3,3" />
          <path d="M 98,75 L 102,62" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
          <path d="M 100,60 Q 88,40 100,10 Q 112,40 100,60 Z" fill="url(#flameGrad)" className="animate-flicker" />
        </svg>
      </div>

      {/* Bottom Right Diya */}
      <div className="absolute bottom-12 right-6 opacity-35 pointer-events-none hidden md:block select-none animate-float-delayed">
        <svg viewBox="0 0 200 150" className="w-48 h-auto drop-shadow-[0_0_40px_rgba(212,175,55,0.5)]">
          <path d="M 30,70 Q 100,140 170,70 Q 160,60 150,65 Q 100,85 50,65 Q 40,60 30,70" fill="url(#clayGrad)" stroke="#6B4E12" strokeWidth="2" />
          <path d="M 55,75 Q 100,95 145,75" fill="none" stroke="#FFE58F" strokeWidth="1" strokeDasharray="3,3" />
          <path d="M 98,75 L 102,62" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
          <path d="M 100,60 Q 88,40 100,10 Q 112,40 100,60 Z" fill="url(#flameGrad)" className="animate-flicker" />
          
          <defs>
            <linearGradient id="clayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3d2608" />
              <stop offset="50%" stopColor="#8A5A1B" />
              <stop offset="100%" stopColor="#251603" />
            </linearGradient>
            <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FF4500" />
              <stop offset="40%" stopColor="#FF8C00" />
              <stop offset="80%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFFFE0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto text-center space-y-12 relative z-10 py-16 w-full">
        {/* CSS Keyframes & Custom Classes */}
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
            50% { transform: translateY(-20px) scale(1.05); opacity: 1; }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0) scale(1.05); opacity: 0.7; }
            50% { transform: translateY(-20px) scale(1); opacity: 1; }
          }
          @keyframes shimmer {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          @keyframes shine {
            to { background-position: 200% center; }
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes flicker {
            0%, 100% { transform: scale(1) rotate(-1deg); opacity: 0.9; filter: drop-shadow(0 0 8px rgba(255,215,0,0.8)); }
            50% { transform: scale(1.06) rotate(1.5deg); opacity: 1; filter: drop-shadow(0 0 15px rgba(255,180,0,1)); }
          }
          
          /* Animation utility classes */
          .animate-fadeUp {
            animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float-delayed 10s ease-in-out infinite;
          }
          .animate-shimmer {
            background-size: 200% auto;
            animation: shimmer 6s linear infinite;
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 35s linear infinite;
          }
          .marquee-container:hover .animate-marquee {
            animation-play-state: paused;
          }
          .animate-flicker {
            animation: flicker 1.8s ease-in-out infinite;
            transform-origin: bottom center;
          }

          /* Stagger delays */
          .delay-100 { animation-delay: 100ms; }
          .delay-200 { animation-delay: 200ms; }
          .delay-300 { animation-delay: 300ms; }
          .delay-400 { animation-delay: 400ms; }
          .delay-500 { animation-delay: 500ms; }
        `}</style>

        {/* Premium Logo Layout - Mockup Match */}
        <div className="animate-fadeUp delay-100 flex flex-col items-center justify-center space-y-3 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#FFE58F] via-[#D4AF37] to-[#AA7C11] p-[1.5px] shadow-[0_0_25px_rgba(212,175,55,0.45)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-black/90 flex items-center justify-center">
              <Icon icon="solar:crown-minimalistic-bold" className="text-[#D4AF37] size-8 animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold tracking-[0.25em] text-white">THE SOVEREIGN</h2>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-semibold mt-1.5">Art Hall & Marketplace</p>
          </div>
        </div>

        {/* Heading & description */}
        <div className="space-y-6">
          <h1 className="animate-fadeUp delay-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-extrabold text-white tracking-wider leading-[1.1] max-w-5xl mx-auto uppercase">
            Where Masterpieces Find <br className="hidden sm:block" />
            Their <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#FFE58F] animate-shimmer drop-shadow-[0_0_30px_rgba(212,175,55,0.25)]">Collectors</span>
          </h1>
          <p className="animate-fadeUp delay-300 text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            Discover, acquire, and preserve premium physical and digital artworks from the world`s most talented creators. <strong className="text-gray-200 font-medium">Fully insured logistics</strong> and <strong className="text-gray-200 font-medium">blockchain authentication</strong> included.
          </p>
        </div>

        {/* Core Interactive Row: Marquee Gallery on Left, Action Buttons Stacked on Right */}
        <div className="animate-fadeUp delay-400 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto pt-6 px-4">
          {/* Left/Middle Column: Gallery Marquee Container */}
          <div className="lg:col-span-2 relative overflow-hidden bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl flex items-center group/marquee marquee-container h-[350px]">
            
            {/* Edge Fading Overlays */}
            <div className="w-16 h-full absolute left-0 top-0 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none"></div>
            <div className="w-16 h-full absolute right-0 top-0 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none"></div>
            
            {/* Marquee Track */}
            <div className="animate-marquee gap-6">
              {marqueeImages.map((src, i) => (
                <div 
                  key={i} 
                  className="w-44 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] border border-white/5 shrink-0 transition-all duration-300 hover:scale-105 hover:border-[#D4AF37]/30"
                >
                  <img 
                    src={src} 
                    alt={`Exhibition Painting ${i + 1}`} 
                    className="w-full h-full object-cover" 
                    loading="lazy" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Stacked Action Buttons */}
          <div className="lg:col-span-1 flex flex-col gap-6 justify-center w-full">
            {/* Solar Shop Button */}
            <Link
              href="/shop"
              className="w-full p-5 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#FFE58F] text-black rounded-2xl flex items-center gap-4 hover:brightness-105 transition-all duration-300 shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.3)] hover:-translate-y-0.5 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out] bg-[length:200%_100%]"></div>
              <div className="w-12 h-12 rounded-xl bg-black/10 flex items-center justify-center shrink-0">
                <Icon icon="solar:crown-minimalistic-bold" className="size-6 text-black animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-black/70">Solar shop</span>
                <span className="text-base font-extrabold tracking-wide">Explore Gallery</span>
              </div>
              <Icon icon="solar:arrow-right-linear" className="size-5 text-black ml-auto transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>

            {/* Solar Gallery Button */}
            <Link
              href="/shop"
              className="w-full p-5 bg-white/[0.02] backdrop-blur-md border border-white/[0.08] hover:border-[#D4AF37]/30 text-white rounded-2xl flex items-center gap-4 hover:bg-white/[0.06] transition-all duration-300 shadow-xl hover:-translate-y-0.5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <Icon icon="solar:gallery-bold" className="size-6 text-[#D4AF37] group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-gray-500">Solar gallery</span>
                <span className="text-base font-extrabold tracking-wide text-gray-200">View Collections</span>
              </div>
              <Icon icon="solar:arrow-right-linear" className="size-5 text-[#D4AF37] ml-auto transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </div>

        {/* Features list - Upgraded to interactive glassmorphic rows */}
        <div className="animate-fadeUp delay-500 pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto bg-white/[0.01] backdrop-blur-xl border border-white/[0.05] rounded-3xl py-4 px-6 shadow-2xl relative overflow-hidden">
            {/* Subtle glow layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/2 to-transparent pointer-events-none"></div>
            
            <div className="flex flex-col items-center justify-center p-4 relative group cursor-default transition-all duration-300 hover:bg-white/[0.02] rounded-2xl">
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -top-2 px-2 py-0.5 text-[9px] font-bold text-black bg-[#D4AF37] rounded-md tracking-wider shadow-[0_4px_12px_rgba(212,175,55,0.3)]">Hover state</span>
              <span className="text-base sm:text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300">100% Insured Shipping</span>
              <p className="text-xs text-gray-500 mt-1 font-light">Text navigations defined</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 relative sm:border-x border-white/10 group cursor-default transition-all duration-300 hover:bg-white/[0.02] rounded-2xl">
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -top-2 px-2 py-0.5 text-[9px] font-bold text-black bg-[#D4AF37] rounded-md tracking-wider shadow-[0_4px_12px_rgba(212,175,55,0.3)]">Hover state</span>
              <span className="text-base sm:text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300">On-Chain Provenance Logs</span>
              <p className="text-xs text-gray-500 mt-1 font-light">Provenance logs defined</p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 relative group cursor-default transition-all duration-300 hover:bg-white/[0.02] rounded-2xl">
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -top-2 px-2 py-0.5 text-[9px] font-bold text-black bg-[#D4AF37] rounded-md tracking-wider shadow-[0_4px_12px_rgba(212,175,55,0.3)]">Hover state</span>
              <span className="text-base sm:text-lg font-bold text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-all duration-300">Premium Art Curation</span>
              <p className="text-xs text-gray-500 mt-1 font-light">Hover curations defined</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;