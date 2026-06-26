"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

// Scroll reveal animated container
const FadeInWhenVisible = ({ children, delay = 0, yOffset = 40 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className="transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1)"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : `translateY(${yOffset}px)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const AboutArtHall = () => {
  const stats = [
    { label: "Acquired Masterpieces", value: "12,000+", icon: "solar:gallery-bold-duotone" },
    { label: "Verified Global Artists", value: "250+", icon: "solar:users-group-two-rounded-bold-duotone" },
    { label: "Corporate Partners", value: "18+", icon: "solar:shop-bold-duotone" },
    { label: "Customer Satisfaction", value: "99.2%", icon: "solar:like-bold-duotone" },
  ];

  const values = [
    {
      title: "Unyielding Authenticity",
      desc: "Every single creation hosted on Art Hall undergoes rigorous chemical and digital inspection by leading curators to lock in 100% genuine origin chains.",
      icon: "solar:shield-check-linear",
    },
    {
      title: "Global Accessibility",
      desc: "Connecting isolated regional creators with elite global investors through custom logistic routing, duty resolution support, and real-time tracking systems.",
      icon: "solar:earth-linear",
    },
    {
      title: "Fair Value Standards",
      desc: "By removing intermediary commission agents, we facilitate peer-to-peer artist transactions. This ensures painters keep up to 90% of their canvas sales.",
      icon: "solar:bill-list-linear",
    },
  ];

  const timeline = [
    {
      year: "2021",
      title: "Inception & Core Framework",
      desc: "Founded by a collaborative consortium of modern galleries and software engineers to address the rising challenges of digital fine art provenance.",
    },
    {
      year: "2023",
      title: "Going Global & Partner Alliances",
      desc: "Partnered with apex framing houses and logistics chains to provide climate-controlled transit and custom physical framing straight from purchase interfaces.",
    },
    {
      year: "2025",
      title: "The Artist Empowerment Pledge",
      desc: "Reformed commission layers, raising payouts to creators to a record 90%. Added physical NFC art tags onto framing mounts to prevent physical duplication.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300 py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* Hero Section */}
        <FadeInWhenVisible yOffset={30}>
          <div className="relative rounded-3xl bg-gradient-to-br from-[#161616] to-[#0D0D0E] border border-[#D4AF37]/20 p-8 md:p-12 lg:p-16 overflow-hidden flex flex-col lg:flex-row items-center gap-10">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/3 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="space-y-6 lg:w-3/5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/20 rounded-full px-3.5 py-1.5 bg-[#D4AF37]/5">
                Our Narrative
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-white leading-tight">
                Where Premium Art <br />
                Meets Modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]">Provenance</span>
              </h1>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                Art Hall is a curated marketplace designed to bridge the gap between discerning collectors and visionary creators. We pair museum-grade physical artworks with permanent blockchain provenance logs.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/shop"
                  className="px-6 py-3 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-xs font-bold rounded-xl shadow-lg hover:brightness-110 transition-all duration-300"
                >
                  Browse Gallery
                </Link>
                <Link
                  href="/team"
                  className="px-6 py-3 border border-zinc-800 hover:border-zinc-700 text-white text-xs font-bold rounded-xl transition-all duration-300"
                >
                  Meet Our Partners
                </Link>
              </div>
            </div>

            {/* Decorative Image/Box */}
            <div className="lg:w-2/5 w-full flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#D4AF37]/15 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop"
                  alt="Fine Art Exhibition"
                  className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                  <div>
                    <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block">Featured Exhibit</span>
                    <span className="text-xs text-white font-serif font-bold">The Golden Symphony Hall</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Stats Grid */}
        <FadeInWhenVisible yOffset={30} delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-[#161616]/40 border border-zinc-900 rounded-2xl p-6 text-center space-y-2 hover:border-[#D4AF37]/25 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mx-auto border border-[#D4AF37]/10">
                  <Icon icon={stat.icon} className="text-xl" />
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight pt-1">
                  {stat.value}
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeInWhenVisible>

        {/* Core Values Section */}
        <div className="space-y-12">
          <FadeInWhenVisible yOffset={30}>
            <div className="text-center space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest">
                Our Foundation
              </span>
              <h2 className="text-3xl font-serif font-bold text-white">
                Core Philosophy & Standards
              </h2>
              <p className="text-xs text-gray-400 max-w-lg mx-auto">
                Maintaining transparency and security guidelines ensures the premium collection cycle remains uncorrupted.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <FadeInWhenVisible key={i} delay={i * 80} yOffset={40}>
                <div className="bg-[#161616]/80 border border-zinc-800/80 rounded-2xl p-6 space-y-4 hover:border-[#D4AF37]/30 transition-all duration-300 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-zinc-900 flex items-center justify-center border border-[#D4AF37]/20 text-[#D4AF37]">
                      <Icon icon={v.icon} className="text-2xl" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-white">
                      {v.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-zinc-900 text-[10px] text-gray-500">
                    Art Hall Authenticated
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>

        {/* Timeline Timeline Milestones */}
        <div className="space-y-12">
          <FadeInWhenVisible yOffset={30}>
            <div className="text-center space-y-3">
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-widest">
                Milestones
              </span>
              <h2 className="text-3xl font-serif font-bold text-white font-bold">
                Our Chronicle Timeline
              </h2>
              <p className="text-xs text-gray-400 max-w-lg mx-auto">
                Follow our trajectory from a technology-based experiment to a trusted global ecosystem.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="relative border-l-2 border-zinc-800/80 ml-4 md:ml-32 space-y-12 py-4">
            {timeline.map((item, i) => (
              <FadeInWhenVisible key={i} delay={i * 100} yOffset={30}>
                <div className="relative pl-8 md:pl-12 group">
                  {/* Timeline dot */}
                  <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-black border-2 border-[#D4AF37] group-hover:scale-125 transition-transform duration-300"></div>

                  {/* Desktop Year Label */}
                  <span className="hidden md:block absolute left-[-110px] top-0 text-xl font-serif font-bold text-[#D4AF37]">
                    {item.year}
                  </span>

                  {/* Main card */}
                  <div className="bg-[#161616]/40 border border-zinc-900 rounded-2xl p-6 space-y-2 max-w-3xl hover:border-zinc-800 transition-all duration-300">
                    <span className="inline-block md:hidden text-sm font-bold text-[#D4AF37] mb-1">
                      {item.year}
                    </span>
                    <h4 className="text-base font-serif font-bold text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>

        {/* CTA Join Section */}
        <FadeInWhenVisible yOffset={30}>
          <div className="rounded-3xl bg-gradient-to-r from-[#AA7C11]/10 via-[#D4AF37]/5 to-zinc-900 border border-[#D4AF37]/20 p-8 md:p-12 text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-serif font-extrabold text-white leading-snug">
              Shape the Future of Fine Art Trading
            </h3>
            <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
              Join as a verified creator to display your canvasses globally, or register as a private collector to secure authenticated masterpieces.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-xs font-bold rounded-xl shadow-lg hover:brightness-110 transition-all duration-300"
              >
                Become a Collector
              </Link>
              <Link
                href="/shop"
                className="px-6 py-3 border border-zinc-800 hover:border-zinc-700 text-white text-xs font-bold rounded-xl transition-all duration-300"
              >
                Browse Masterpieces
              </Link>
            </div>
          </div>
        </FadeInWhenVisible>

      </div>
    </div>
  );
};

export default AboutArtHall;