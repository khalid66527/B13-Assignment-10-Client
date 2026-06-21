import React from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

const ArtCard = ({ art }) => {
    return (
        <div className="group bg-gradient-to-b from-[#161616] to-[#0F0F0F] border border-white/5 rounded-3xl p-4 hover:border-[#D4AF37]/30 transition-all duration-300 flex flex-col h-full relative overflow-hidden">

            {/* ইমেজ সেকশন */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1A1A1A] mb-4 shrink-0">
                <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold text-[#FFE58F] tracking-wider">
                    {art.category}
                </div>
            </div>

            {/* টেক্সট ও কন্টেন্ট */}
            <div className="flex flex-col flex-grow space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-[#FFE58F] transition-colors">
                        {art.title}
                    </h3>
                    <span className="text-base font-extrabold text-[#D4AF37] shrink-0">
                        ${art.price}
                    </span>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-grow">
                    {art.description}
                </p>

                {/* এক্সট্রা ইনফো (ডাইমেনশন ও ডেট) */}
                <div className="flex items-center justify-between text-[11px] text-gray-600 border-t border-white/5 pt-2 mt-auto">
                    <span className="flex items-center gap-1">
                        <Icon icon="solar:ruler-linear" /> {art.dimensions || 'N/A'}
                    </span>
                    <span>{art.date}</span>
                </div>

                {/* ডিটেইলস বাটন */}
                <Link
                    href={`/shop/${art._id || art.id}`} // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী পাথটি মিলিয়ে নেবেন (যেমন: /shop/id)
                    className="w-full mt-3 bg-[#1A1A1A] hover:bg-[#D4AF37] text-gray-300 hover:text-black border border-white/5 hover:border-transparent py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                    View Details
                    <Icon icon="solar:arrow-right-linear" className="size-3" />
                </Link>
            </div>

        </div>
    );
};

export default ArtCard;