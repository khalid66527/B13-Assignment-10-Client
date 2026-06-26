import React from 'react';
import CommentPage from './CommentPage';
import { getUserSession } from '@/lib/core/session';

const page = async ({ params }) => {
    const { id } = await params;
    const user = await getUserSession();
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#161616]/90 to-[#0F0F0F]/95 border border-[#D4AF37]/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
                <CommentPage artworkId={id} user={user} />
            </div>
        </div>
    );
};

export default page;