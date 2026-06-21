'use client';
import React, { useState } from 'react';

import ArtCard from '../components/shop/ArtCard';
import FilterNavbar from '../components/shop/FilterNavbar';


const AllArtsShopPage = ({ allarts = [] }) => {
  // ফিল্টার স্টেটসমূহ
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceOrder, setPriceOrder] = useState('default'); // 'default', 'lowToHigh', 'highToLow'

  // ফিল্টারিং এবং সর্টিং লজিক
  const filteredArts = allarts
    .filter((art) => {
      // ১. সার্চ ফিল্টার (টাইটেল ম্যাচিং)
      const matchesSearch = art.title?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // ২. ক্যাটাগরি ফিল্টার
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      
      if (priceOrder === 'lowToHigh') {
        return Number(a.price) - Number(b.price);
      }
      if (priceOrder === 'highToLow') {
        return Number(b.price) - Number(a.price);
      }
      return 0; // ডিফল্ট অর্ডার
    });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* হেডার সেকশন */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE58F] via-[#D4AF37] to-[#AA7C11] tracking-tight mb-2">
            Art Marketplace
          </h1>
          <p className="text-gray-500 text-sm">Explore and collect premium digital and physical masterpieces.</p>
        </div>

        {/* ফিল্টার বার কম্পোনেন্ট */}
        <FilterNavbar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory}
          priceOrder={priceOrder} 
          setPriceOrder={setPriceOrder}
        />

        {/* আর্ট গ্রিড সেকশন */}
        {filteredArts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredArts.map((art, index) => (
              <ArtCard key={art._id || art.id || index} art={art} />
            ))}
          </div>
        ) : (
          /* নো ডাটা ফাউন্ড মেসেজ */
          <div className="text-center py-20 bg-[#121212] rounded-3xl border border-white/5">
            <p className="text-gray-500 text-base">No artworks found matching your criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllArtsShopPage;