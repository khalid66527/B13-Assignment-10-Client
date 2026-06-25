"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { getAllCompanies } from "@/lib/api/companies";

// Default fallback premium benefits mock companies if the database is empty
const defaultPartners = [
  {
    _id: "comp-1",
    companyName: "Apex Framing & Co.",
    category: "Art Preservation & Framing",
    description: "An industry leader in custom museum-grade framing. Preserving art legacy with acid-free mats, UV-filtered glass, and premium woods.",
    website: "https://apexframing.com",
    location: "New York, USA",
    employeeCountRange: "50-100",
    companyLogo: "",
    benefitTitle: "Premium Custom Framing",
    benefitDesc: "Provides a 25% discount on custom museum-grade framing, free protective glass upgrades, and custom installation consultations for all purchases.",
    logoIcon: "solar:frame-linear",
    color: "from-blue-500/20 to-cyan-500/10",
    textColor: "text-blue-400",
  },
  {
    _id: "comp-2",
    companyName: "SafePassage Logistics",
    category: "High-Value Shipping & Insurances",
    description: "Specialized climate-controlled transportation, white-glove packaging, and full-coverage maritime and land shipping insurance policies.",
    website: "https://safepassagelogistics.com",
    location: "Rotterdam, Netherlands",
    employeeCountRange: "250-500",
    companyLogo: "",
    benefitTitle: "Secure Climate-Controlled Shipping",
    benefitDesc: "Provides free shipping insurance (up to $50,000 value), real-time temperature tracking, and guaranteed white-glove home delivery in 48 hours.",
    logoIcon: "solar:box-linear",
    color: "from-emerald-500/20 to-teal-500/10",
    textColor: "text-emerald-400",
  },
  {
    _id: "comp-3",
    companyName: "AuthentiTrust Labs",
    category: "Smart Blockchain Verification",
    description: "Creating permanent digital provenance chains. Linking raw material certificates, physical RFID art tags, and public ledger transactions.",
    website: "https://authentitrust.io",
    location: "Tokyo, Japan",
    employeeCountRange: "20-50",
    companyLogo: "",
    benefitTitle: "Blockchain Provenance Certificates",
    benefitDesc: "Issues complimentary tamper-proof digital certificates of authenticity (COA) logged on-chain, and free physical NFC art-tag installation.",
    logoIcon: "solar:shield-check-linear",
    color: "from-[#D4AF37]/20 to-[#AA7C11]/10",
    textColor: "text-[#D4AF37]",
  },
];

const TeamArtistPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePartnerId, setActivePartnerId] = useState("");

  useEffect(() => {
    getAllCompanies()
      .then((data) => {
        if (data && data.length > 0) {
          // Add benefits fields to database companies for presentation purposes
          const processed = data.map((c, index) => {
            const defaults = defaultPartners[index % defaultPartners.length];
            return {
              ...c,
              benefitTitle: c.benefitTitle || defaults.benefitTitle,
              benefitDesc: c.benefitDesc || defaults.benefitDesc,
              logoIcon: defaults.logoIcon,
              color: defaults.color,
              textColor: defaults.textColor,
            };
          });
          setCompanies(processed);
          setActivePartnerId(processed[0]._id);
        } else {
          // If backend has no companies, load default premium mock items
          setCompanies(defaultPartners);
          setActivePartnerId(defaultPartners[0]._id);
        }
      })
      .catch((err) => {
        console.error("Failed to load companies from backend:", err);
        setCompanies(defaultPartners);
        setActivePartnerId(defaultPartners[0]._id);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const selectedPartner = companies.find((p) => p._id === activePartnerId);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300 py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Title Section */}
        <div className="text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/20 rounded-full px-3 py-1 bg-[#D4AF37]/5">
            Art Hall Network
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-white tracking-tight">
            Corporate Partners & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11]">Benefits</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            We collaborate with industry-leading entities to guarantee security, preservation, authenticity, and premium curation support for every single collector.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Icon icon="eos-icons:loading" className="text-4xl text-[#D4AF37] animate-spin" />
            <p className="text-xs text-gray-500">Loading partner database...</p>
          </div>
        ) : (
          /* Corporate Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Partners Listing (Left 2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Icon icon="solar:users-group-two-rounded-linear" className="text-[#D4AF37]" />
                Our Associated Institutions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companies.map((comp) => (
                  <div
                    key={comp._id}
                    onClick={() => setActivePartnerId(comp._id)}
                    className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-6 h-full ${
                      activePartnerId === comp._id
                        ? "bg-[#161616] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/5"
                        : "bg-[#161616]/40 border-zinc-800/80 hover:border-zinc-700/80"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${comp.color || "from-[#D4AF37]/20 to-zinc-950"} flex items-center justify-center border border-[#D4AF37]/10 overflow-hidden shrink-0`}>
                          {comp.companyLogo ? (
                            <img
                              src={comp.companyLogo}
                              alt={comp.companyName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icon icon={comp.logoIcon || "solar:shop-linear"} className={`text-2xl ${comp.textColor || "text-[#D4AF37]"}`} />
                          )}
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                          {comp.employeeCountRange ? `${comp.employeeCountRange} Employees` : "Partnered"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-serif font-extrabold text-white group-hover:text-[#D4AF37] transition-colors">
                          {comp.companyName}
                        </h3>
                        <p className="text-[11px] text-[#D4AF37] uppercase tracking-wider font-semibold">
                          {comp.category}
                        </p>
                      </div>

                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                        {comp.description || "Associated partner supporting digital collection and distribution logistics for creators globally."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60 text-[11px] text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Icon icon="solar:map-point-linear" className="text-[#D4AF37]" />
                        <span>{comp.location || "Global Network"}</span>
                      </div>
                      {comp.website && (
                        <a
                          
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#D4AF37] font-semibold flex items-center gap-0.5 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit Website <Icon icon="solar:arrow-right-linear" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Benefits Panel (Right 1 col) */}
            <div className="space-y-6">
              <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Icon icon="solar:gift-linear" className="text-[#D4AF37]" />
                Selected Benefit Details
              </h2>
              {selectedPartner ? (
                <div className="bg-gradient-to-b from-[#161616] to-[#0A0A0A] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-xl space-y-6">
                  
                  {/* Header info */}
                  <div className="space-y-3">
                    <div className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 uppercase tracking-widest">
                      Partner Guarantee
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white leading-snug">
                      {selectedPartner.companyName}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Offers exclusive rights, protection protocols, and financial incentives to our collectors.
                    </p>
                  </div>

                  {/* Primary Benefit Card */}
                  <div className="bg-[#1C1C1E] border border-zinc-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:check-circle-bold-duotone" className="text-[#D4AF37] text-lg" />
                      <h4 className="text-sm font-bold text-white">
                        {selectedPartner.benefitTitle || "Exclusive Partner Benefit"}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {selectedPartner.benefitDesc || "Provides custom services and specialized support for acquired assets."}
                    </p>
                  </div>

                  {/* Terms Overview */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                      How to redeem benefits:
                    </h4>
                    <ul className="space-y-3 text-xs text-gray-400">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                        <span>Buy any eligible artwork marked with the partner guarantee badge.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                        <span>Verify shipping or framing parameters during checkout.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                        <span>Your provenance certificate is minted automatically upon arrival.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Action button */}
                  <div className="pt-4">
                    <a
                      href="/collections"
                      className="w-full py-3 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] hover:brightness-110 text-black text-xs font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5"
                    >
                      Explore Artworks
                      <Icon icon="solar:compass-linear" className="text-sm" />
                    </a>
                  </div>

                </div>
              ) : (
                <div className="h-64 border border-dashed border-zinc-800 rounded-2xl flex items-center justify-center text-gray-500 text-sm">
                  Select a company on the left to show its benefits.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Global Security Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#161616] via-[#1A1A1A] to-[#161616] border border-[#D4AF37]/15 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#D4AF37]/3 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl font-serif font-bold text-white">
              Securing Every Step of the Acquisition Cycle
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every masterpiece traded on Art Hall qualifies for verification logs, transport protection, and professional framing vouchers automatically. No additional applications needed.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-4">
            <div className="flex -space-x-3">
              {companies.slice(0, 4).map((c, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full bg-zinc-900 border-2 border-[#0A0A0A] flex items-center justify-center overflow-hidden ${c.textColor || "text-[#D4AF37]"}`}
                >
                  {c.companyLogo ? (
                    <img src={c.companyLogo} alt={c.companyName} className="w-full h-full object-cover" />
                  ) : (
                    <Icon icon={c.logoIcon || "solar:shop-linear"} className="text-sm" />
                  )}
                </div>
              ))}
            </div>
            <div>
              <span className="text-xs text-white font-bold block">100% Protected</span>
              <span className="text-[10px] text-gray-500">Fully insured and authentic</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeamArtistPage;