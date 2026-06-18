"use client";

import React from "react";
import Link from "next/link";
import {
    Envelope,
    ArrowRight,

} from "@gravity-ui/icons";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
    // Scroll to top handler for the black button
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-[#f5f4ef] text-[#4a4a4a] pt-16 pb-8 border-t border-[#e2dfd3]">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">

                {/* --- TOP SECTION: 4 Columns --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">

                    {/* Column 1: About Us */}
                    <div>
                        <h3 className="text-xl font-serif text-[#1a1a1a] mb-6">About Us</h3>
                        <p className="text-sm leading-relaxed pr-4">
                            Ignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.
                        </p>
                    </div>

                    {/* Column 2: Contacts */}
                    <div>
                        <h3 className="text-xl font-serif text-[#1a1a1a] mb-6">Contacts</h3>
                        <address className="not-italic text-sm leading-relaxed mb-4">
                            Germany 785 15h Street, Office 478<br />
                            Berlin, De 81566
                        </address>
                        <Link
                            href="#"
                            className="text-sm border-b border-[#a8a69d] hover:text-black transition-colors"
                        >
                            View on Google Map
                        </Link>
                        <div className="mt-6">
                            <p className="font-bold text-[#1a1a1a] text-lg font-serif mb-1">+880 156866527</p>
                            <a href="mailto:info@email.com" className="text-sm hover:text-black transition-colors">
                                khalidhasan678954321@email.com
                            </a>
                        </div>
                    </div>

                    {/* Column 3: Links */}
                    <div>
                        <h3 className="text-xl font-serif text-[#1a1a1a] mb-6">Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-black transition-colors">Home</Link></li>
                            <li><Link href="/shop" className="hover:text-black transition-colors">Shop</Link></li>
                            <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
                            <li><Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link></li>
                            <li><Link href="/contact" className="hover:text-black transition-colors">Contacts</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-xl font-serif text-[#1a1a1a] mb-6">Sign up for Our Newsletter</h3>

                        <form className="flex flex-col gap-4">
                            <div className="relative flex items-center border-b border-[#c2c0b5] pb-2">
                                <Envelope width={16} className="absolute left-0 text-[#7a7a7a]" />
                                <input
                                    type="email"
                                    placeholder="Enter Your Email Address"
                                    className="w-full bg-transparent outline-none pl-7 pr-8 text-sm placeholder:text-[#8a8a8a] text-black"
                                    required
                                />
                                <button
                                    type="submit"
                                    aria-label="Subscribe"
                                    className="absolute right-0 text-[#1a1a1a] hover:translate-x-1 transition-transform"
                                >
                                    <ArrowRight width={18} />
                                </button>
                            </div>

                            <div className="flex items-start gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    className="mt-1 w-3.5 h-3.5 accent-[#1a1a1a] cursor-pointer"
                                    required
                                />
                                <label htmlFor="privacy" className="text-sm cursor-pointer">
                                    I agree to the <Link href="/privacy-policy" className="underline hover:text-black">Privacy Policy</Link>.
                                </label>
                            </div>

                        </form>
                        <div className="">
                            <div className="flex justify-center text-2xl gap-5 pt-5 ">
                                <Link href="#" aria-label="Facebook" className="text-[#7a7a7a] hover:text-[#1a1a1a] transition-colors">
                                    <FaFacebook />
                                </Link>
                                <Link href="#" aria-label="Twitter" className="text-[#7a7a7a] hover:text-[#1a1a1a] transition-colors">

                                    <FaTwitter />
                                </Link>
                                <Link href="#" aria-label="Instagram" className="text-[#7a7a7a] hover:text-[#1a1a1a] transition-colors">
                                    <FaInstagram width={20} />
                                </Link>
                                <Link href="#" aria-label="YouTube" className="text-[#7a7a7a] hover:text-[#1a1a1a] transition-colors">

                                    <FaYoutube width={20} />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- BOTTOM SECTION: Divider, Copyright, Socials, Top Button --- */}
                <div className="mt-16 pt-6 border-t border-[#d8d6cc] flex flex-col md:flex-row justify-center items-center gap-4 relative">

                    <p className="text-sm text-[#7a7a7a]">
                        ArtHub © {new Date().getFullYear()}. All rights reserved.
                    </p>

                 

                </div>
            </div>
        </footer>
    );
}