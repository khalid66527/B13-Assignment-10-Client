'use client';
import React, { useState, useRef } from 'react';
import { Button } from "@heroui/react";
import { Icon } from '@iconify/react';
import { createCompany } from '@/lib/actions/company';

const CompanyProfile = ({ userData }) => {
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false); // লোগো আপলোড স্টেট
  const fileInputRef = useRef(null);

  const categories = ["Art Gallery", "Design Studio", "Corporate Art Buyer", "Auction House", "NFT Platform"];

  const [formData, setFormData] = useState({
    companyName: '',
    category: '',
    website: '',
    location: '',
    employeeCountRange: '',
    companyLogo: '', // এখানে ImgBB থেকে আসা ফাইনাল URL স্টোর হবে
    description: '',
    userId: userData.id,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- ImgBB Image Upload Handler ---
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // .env থেকে API Key নেওয়া হচ্ছে
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      alert("❌ ImgBB API Key is missing in your .env file!");
      return;
    }

    setUploadingLogo(true);

    // ImgBB এর নিয়ম অনুযায়ী FormData তৈরি
    const imageFormData = new FormData();
    imageFormData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: imageFormData,
      });

      const data = await response.json();

      if (data.success) {
        const imageUrl = data.data.url; // ImgBB থেকে প্রাপ্ত ডাইনামিক ইমেজ লিংক
        setFormData((prev) => ({ ...prev, companyLogo: imageUrl }));
        console.log("ImgBB Upload Success URL:", imageUrl);
      } else {
        alert("❌ ImgBB Upload Failed: " + data.error.message);
      }
    } catch (error) {
      console.error("Error uploading to ImgBB:", error);
      alert("❌ Something went wrong during image upload.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, companyLogo: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadingLogo) {
      alert("Please wait until the logo finishes uploading.");
      return;
    }
    setLoading(true);

    try {
      console.log("Saving Company Profile Data:", formData);
   
      const payload = await createCompany(formData)
      if(payload.insertedId){
        alert('Company Created Successfully !')
      }
      setHasProfile(true);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-gray-300 font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Ambient Premium Gold Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#AA7C11]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl">
        
        {!hasProfile ? (
          <div className="bg-gradient-to-b from-[#161616]/80 to-[#0F0F0F]/90 backdrop-blur-xl border border-[#D4AF37]/20 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11] tracking-tight mb-2">
                Register Your Business Profile
              </h2>
              <p className="text-gray-400 text-sm">Please complete your corporate details to set up your business workspace.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Grid Layout Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Company Name
                  </label>
                  <input
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Art Gallery"
                    className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-gray-500">
                        Select Category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#161616]">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                      <Icon icon="solar:alt-arrow-down-linear" />
                    </div>
                  </div>
                </div>

                {/* Website URL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Website
                  </label>
                  <input
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Location
                  </label>
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
                  />
                </div>

                {/* Employee Count Range */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Employee Count Range
                  </label>
                  <div className="relative">
                    <select
                      name="employeeCountRange"
                      value={formData.employeeCountRange}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A1A1A] border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="" className="text-gray-500">Select Range</option>
                      <option value="1-10" className="bg-[#161616]">1 - 10 employees</option>
                      <option value="11-50" className="bg-[#161616]">11 - 50 employees</option>
                      <option value="51-200" className="bg-[#161616]">51 - 200 employees</option>
                      <option value="201-500" className="bg-[#161616]">201 - 500 employees</option>
                      <option value="500+" className="bg-[#161616]">500+ employees</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                      <Icon icon="solar:alt-arrow-down-linear" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Logo Upload & Real-time ImgBB Preview */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Company Logo
                </label>
                
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    disabled={uploadingLogo}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex size-14 items-center justify-center rounded-xl border border-dashed border-[#D4AF37]/40 bg-[#1A1A1A]/60 transition-all hover:bg-[#1A1A1A] relative overflow-hidden shrink-0 group focus:outline-none focus:ring-1 focus:ring-[#D4AF37] ${uploadingLogo ? "cursor-wait opacity-50" : "cursor-pointer"}`}
                  >
                    {formData.companyLogo ? (
                      <img src={formData.companyLogo} alt="Logo Preview" className="w-full h-full object-cover" />
                    ) : uploadingLogo ? (
                      <Icon icon="eos-icons:loading" className="size-6 text-[#D4AF37] animate-spin" />
                    ) : (
                      <Icon icon="solar:upload-linear" className="size-6 text-[#D4AF37]/70 group-hover:scale-110 transition-transform" />
                    )}
                  </button>

                  <input
                    type="file"
                    name="companyLogoInput"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                  />

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {uploadingLogo ? "Uploading to ImgBB..." : "Upload Business Logo"}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">PNG, JPG up to 5MB (Hosted on ImgBB)</span>
                  </div>
                </div>

                {/* Logo URL Preview Container */}
                {formData.companyLogo && (
                  <div className="relative border border-[#D4AF37]/20 rounded-2xl overflow-hidden bg-[#161616] max-w-[200px] p-2 flex items-center justify-center group shadow-md">
                    <img
                      src={formData.companyLogo}
                      alt="Company Logo preview"
                      className="max-h-[120px] rounded-xl object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white shadow-lg transition-all"
                      aria-label="Remove image"
                    >
                      <Icon icon="solar:trash-bin-trash-bold" className="size-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Brief Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Brief Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us about your company's mission, art culture, or corporate vision..."
                  className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm resize-none"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-4 border-t border-[#D4AF37]/10 flex justify-end items-center">
                <Button
                  type="submit"
                  disabled={loading || uploadingLogo}
                  isLoading={loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-bold tracking-wide px-8 py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
                >
                  {loading ? "Saving Profile..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Profile Detail View Screen */
          <div className="bg-gradient-to-b from-[#161616]/80 to-[#0F0F0F]/90 backdrop-blur-xl border border-[#D4AF37]/20 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {formData.companyLogo && (
                <div className="w-24 h-24 rounded-2xl border border-[#D4AF37]/30 bg-[#1A1A1A] p-2 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={formData.companyLogo} alt="Company Logo" className="w-full h-full object-contain rounded-xl" />
                </div>
              )}
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#D4AF37]/10 text-[#FFE58F] border border-[#D4AF37]/20 mb-2">
                    {formData.category}
                  </div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">{formData.companyName}</h1>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-400">
                  {formData.location && (
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:map-point-linear" className="text-[#D4AF37]" />
                      {formData.location}
                    </div>
                  )}
                  {formData.website && (
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:link-linear" className="text-[#D4AF37]" />
                      <a href={formData.website} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-all">
                        {formData.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {formData.employeeCountRange && (
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:users-group-two-rounded-linear" className="text-[#D4AF37]" />
                      {formData.employeeCountRange} Employees
                    </div>
                  )}
                </div>

                <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {formData.description}
                </p>

                <div className="pt-4 flex justify-center md:justify-start">
                  <Button
                    onClick={() => setHasProfile(false)}
                    variant="bordered"
                    className="border border-gray-800 hover:border-[#D4AF37]/50 bg-[#1A1A1A]/40 text-gray-300 hover:text-white rounded-xl transition-all flex items-center gap-2"
                  >
                    <Icon icon="solar:pen-linear" />
                    Edit Business Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;