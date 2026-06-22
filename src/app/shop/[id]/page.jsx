import React from 'react';
import ArtDetails from './ArtDetails';
import { getArtById } from '@/lib/api/arts';
import { getUserSession } from '@/lib/core/session';

const DetailsPage = async ({ params }) => {
    const user =await getUserSession()
    const { id } = await params; 

    const art = await getArtById(id);

    return (
        <div className="min-h-screen bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8">
            <ArtDetails allArt={art} id={id} user={user} />
        </div>
    );
};

export default DetailsPage;