
import { userRole } from '../../../lib/core/session';
import React from 'react';

const ArtistLayout = async ({children}) => {
    await userRole('buyer')
    return children;
    
};

export default ArtistLayout;