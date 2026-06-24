import React from 'react';
import ArtworksTable from './ArtworksTable';
import { getCompanyArts } from '@/lib/api/arts';

const ManageArtworks = async () => {
    let artworks = [];
    let fetchError = false;

    try {
        artworks = await getCompanyArts();
    } catch (error) {
        console.error("Failed to fetch artworks from backend:", error);
        fetchError = true;
    }

    return (
        <div className="space-y-8">
            <ArtworksTable initialArtworks={artworks || []} fetchError={fetchError} />
        </div>
    );
};

export default ManageArtworks;