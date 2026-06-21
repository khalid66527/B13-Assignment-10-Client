import React from 'react';
import { Icon } from '@iconify/react';

const FilterNavbar = ({ 
  searchQuery, setSearchQuery, 
  selectedCategory, setSelectedCategory, 
  priceOrder, setPriceOrder 
}) => {
  
  const categories = ["All", "Painting", "Digital Art", "Sculpture", "Photography"];

  return (
    <div className="bg-[#121212] border border-white/5 rounded-2xl p-4 md:p-6 mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
      
      {/* ক্যাটাগরি নেভবার (বাম পাশে) */}
      <div className="flex flex-wrap gap-2 items-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium tracking-wide transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-bold shadow-md shadow-[#D4AF37]/10'
                : 'bg-[#1A1A1A] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* সার্চ ও প্রাইস সর্ট (ডান পাশে) */}
      <div className="flex flex-col sm:flex-row gap-3 md:w-auto w-full">
        {/* সার্চ ইনপুট */}
        <div className="relative flex-1 sm:w-64">
          <input
            type="text"
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/5 focus:border-[#D4AF37]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
          />
          <Icon icon="solar:magnifer-linear" className="absolute left-3.5 top-3 text-gray-500 size-4" />
        </div>

        {/* প্রাইস ড্রপডাউন */}
        <div className="relative sm:w-48">
          <select
            value={priceOrder}
            onChange={(e) => setPriceOrder(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/5 focus:border-[#D4AF37]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="default">Price: Featured</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
          <Icon icon="solar:dollar-minimalistic-linear" className="absolute left-3.5 top-3 text-gray-500 size-4" />
          <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3.5 top-3.5 text-gray-500 size-3 pointer-events-none" />
        </div>
      </div>

    </div>
  );
};

export default FilterNavbar;