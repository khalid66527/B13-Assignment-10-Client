"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { createArt } from "@/lib/actions/artstor";
import { redirect } from "next/navigation";

export default function NewArtPostForm({company}) {
  // console.log("CompanyjData",company);
  const [companyObj = {}] = company || [];

  // শুধুমাত্র ইমেজ লিংকের প্রিভিউর জন্য State
  const [imagePreview, setImagePreview] = useState("");

  const categories = ["Painting", "Digital Art", "Sculpture", "Photography"];

  const onSubmitDara = async(e) => {
    e.preventDefault();
     
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());
    
   const NewCompanyAndFormData = {
    ...formValues,
    companyName: companyObj.companyName,
    companyLogo:companyObj.companyLogo,
    companyId:companyObj._id,

   }


    const res = await createArt(NewCompanyAndFormData)
    if(res.insertedId){
      alert("Art Posted Successfully !")
      e.target.reset();
      redirect('/dashboard/artist/allarts')
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    // ইনপুট ফিল্ড ক্লিয়ার করা
    const imageInput = document.getElementById("art-image");
    if (imageInput) imageInput.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn p-4 md:p-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-white">
          Artwork Form UI
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Frontend form design with image URL preview.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="bg-gradient-to-b from-[#161616]/90 to-[#0F0F0F]/95 border border-[#D4AF37]/15 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

        <form onSubmit={onSubmitDara} className="space-y-8">
          
          {/* Section 1: Input fields grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="art-title" className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Artwork Title
              </label>
              <input
                id="art-title"
                name="title"
                type="text"
                required
                placeholder="e.g. Whispers of Autumn"
                className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-2">
              <label htmlFor="art-category" className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Category
              </label>
              <select
                id="art-category"
                name="category"
                required
                defaultValue=""
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
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="art-price" className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Price (USD $)
              </label>
              <input
                id="art-price"
                name="price"
                type="number"
                required
                min="0.01"
                step="0.01"
                placeholder="e.g. 350.00"
                className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
              />
            </div>

            {/* Dimensions */}
            <div className="space-y-2">
              <label htmlFor="art-dimensions" className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Dimensions / Size
              </label>
              <input
                id="art-dimensions"
                name="dimensions"
                type="text"
                placeholder="e.g. 24 x 36 inches"
                className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label htmlFor="art-date" className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Date
              </label>
              <input
                id="art-date"
                name="date"
                type="date"
                required
                className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Section 2: Image Link Upload (Moved here) */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="art-image" className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Artwork Image Link
              </label>
              <input
                id="art-image"
                name="image"
                type="url"
                required
                placeholder="Paste your image URL here (e.g. https://example.com/image.jpg)"
                onChange={(e) => setImagePreview(e.target.value)}
                className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm"
              />
            </div>
            
            {/* Image Preview Section */}
            {imagePreview && (
              <div className="relative border border-[#D4AF37]/20 rounded-2xl overflow-hidden bg-[#1c1d17]/50 max-h-[350px] flex items-center justify-center p-4">
                <img
                  src={imagePreview}
                  alt="Artwork preview"
                  className="max-h-[320px] rounded-xl object-contain shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "block";
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all"
                  aria-label="Remove image link"
                >
                  <Icon icon="solar:trash-bin-trash-bold" />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="art-description" className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Artwork Description
            </label>
            <textarea
              id="art-description"
              name="description"
              required
              rows={4}
              placeholder="Tell collectors the story behind this piece, inspiration, theme..."
              className="w-full bg-[#1A1A1A]/60 border border-[#D4AF37]/20 focus:border-[#D4AF37] rounded-xl px-4 py-3 text-white placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-sm resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#D4AF37]/10 flex justify-end items-center">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-bold tracking-wide px-8 py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
            >
              Submit Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}