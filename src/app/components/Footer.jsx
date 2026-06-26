"use client";

import React from "react";
import Link from "next/link";
import { Envelope, ArrowRight } from "@gravity-ui/icons";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Icon } from "@iconify/react";

export default function Footer() {
    // Scroll to top handler
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-[#050505] text-gray-400 pt-20 pb-10 border-t border-[#D4AF37]/15 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">

                {/* --- TOP SECTION: 4 Columns --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

                    {/* Column 1: Brand & About Us */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#FFE58F] via-[#D4AF37] to-[#AA7C11] p-[1.5px] shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                    <Icon icon="solar:crown-minimalistic-bold" className="text-[#D4AF37] size-6" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base font-serif font-extrabold tracking-[0.15em] text-white">THE SOVEREIGN</h3>
                                <p className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mt-0.5">Art Hall & Marketplace</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed pr-4 text-gray-500 font-light">
                            Discover, acquire, and preserve premium physical and digital artworks from the world`s most talented creators. Verified origin chains and museum-grade security.
                        </p>
                    </div>

                    {/* Column 2: Contacts */}
                    <div>
                        <h3 className="text-base font-serif font-bold text-white mb-6 uppercase tracking-wider">Contacts</h3>
                        <div className="space-y-4 text-sm text-gray-500 font-light">
                            <address className="not-italic leading-relaxed flex items-start gap-3">
                                <Icon icon="solar:map-point-linear" className="text-[#D4AF37] size-5 shrink-0 mt-0.5" />
                                <span>
                                    Germany 785 15h Street, Office 478<br />
                                    Berlin, De 81566
                                </span>
                            </address>
                            <Link
                                href="#"
                                className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#FFE58F] hover:underline transition-colors mt-1"
                            >
                                <span>View on Google Map</span>
                                <Icon icon="solar:arrow-right-up-linear" className="size-3" />
                            </Link>
                            <div className="pt-2 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Icon icon="solar:phone-calling-linear" className="text-[#D4AF37] size-5 shrink-0" />
                                    <p className="font-bold text-gray-200 text-base font-serif">+880 156866527</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon icon="solar:letter-linear" className="text-[#D4AF37] size-5 shrink-0" />
                                    <a href="mailto:info@email.com" className="hover:text-white transition-colors text-gray-300 font-normal">
                                        khalidhasan678954321@email.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Links */}
                    <div>
                        <h3 className="text-base font-serif font-bold text-white mb-6 uppercase tracking-wider">Navigation</h3>
                        <ul className="space-y-3 text-sm text-gray-500 font-light">
                            {[
                                { name: "Home", href: "/" },
                                { name: "Shop", href: "/shop" },
                                { name: "About Us", href: "/about" },
                                { name: "Pricing", href: "/pricing" },
                                { name: "Contacts", href: "/contact" }
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link 
                                        href={link.href} 
                                        className="group flex items-center gap-1.5 hover:text-white transition-all duration-300 transform hover:translate-x-1.5"
                                    >
                                        <Icon icon="solar:alt-arrow-right-linear" className="size-3 opacity-0 group-hover:opacity-100 text-[#D4AF37] transition-all duration-300" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div className="space-y-6">
                        <h3 className="text-base font-serif font-bold text-white uppercase tracking-wider">Stay Inspired</h3>
                        <p className="text-xs text-gray-500 font-light leading-relaxed">
                            Sign up to receive curated art alerts, creator spotlight interviews, and exclusive private hall exhibition passes.
                        </p>
                        <form className="flex flex-col gap-4">
                            <div className="relative flex items-center bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5 focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]/35 transition-all duration-300">
                                <Envelope width={16} className="text-gray-500 mr-3" />
                                <input
                                    type="email"
                                    placeholder="Enter Your Email Address"
                                    className="w-full bg-transparent outline-none text-xs placeholder:text-gray-600 text-white"
                                    required
                                />
                                <button
                                    type="submit"
                                    aria-label="Subscribe"
                                    className="text-[#D4AF37] hover:text-white hover:translate-x-1 transition-all duration-300 ml-2"
                                >
                                    <ArrowRight width={18} />
                                </button>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    className="mt-1 w-4 h-4 rounded border-white/10 bg-[#050505] text-[#D4AF37] focus:ring-0 cursor-pointer accent-[#D4AF37]"
                                    required
                                />
                                <label htmlFor="privacy" className="text-[11px] text-gray-500 cursor-pointer select-none leading-relaxed">
                                    I agree to the <Link href="/privacy-policy" className="text-gray-400 underline hover:text-[#D4AF37]">Privacy Policy</Link>.
                                </label>
                            </div>
                        </form>

                        <div className="pt-2">
                            <div className="flex gap-3">
                                {[
                                    { icon: <FaFacebook />, label: "Facebook", href: "#" },
                                    { icon: <FaTwitter />, label: "Twitter", href: "#" },
                                    { icon: <FaInstagram />, label: "Instagram", href: "#" },
                                    { icon: <FaYoutube />, label: "YouTube", href: "#" }
                                ].map((social, i) => (
                                    <Link 
                                        key={i}
                                        href={social.href} 
                                        aria-label={social.label} 
                                        className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gradient-to-r hover:from-[#AA7C11] hover:to-[#D4AF37] hover:border-transparent transition-all duration-300 shadow-md hover:shadow-[0_0_12px_rgba(212,175,55,0.3)] hover:-translate-y-1"
                                    >
                                        {social.icon}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- BOTTOM SECTION: Divider, Copyright, Back to Top --- */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                    <p className="text-xs text-gray-600">
                        THE SOVEREIGN ART HALL © {new Date().getFullYear()}. All rights reserved.
                    </p>
                    
                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/40 text-xs text-gray-500 hover:text-white transition-all duration-300 hover:-translate-y-0.5 shadow-lg group cursor-pointer"
                    >
                        <span>Back to Top</span>
                        <Icon icon="solar:arrow-up-linear" className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 text-[#D4AF37]" />
                    </button>
                </div>
            </div>
        </footer>
    );
}