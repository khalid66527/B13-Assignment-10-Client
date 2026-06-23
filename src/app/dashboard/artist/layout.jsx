import { artistRole } from '@/lib/core/session';
import React from 'react';

const ArtistLayout = async ({children}) => {
    await artistRole('artist')
    return children;
    
};

export default ArtistLayout;