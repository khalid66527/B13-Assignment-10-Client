import React from 'react';
import AllArtsShopPage from './AllArtsShopPage';
import { getCompanyArts } from '@/lib/api/arts';

const ArtCartPage =async () => {
    const allarts = await getCompanyArts()
    return (
        <div>
            <AllArtsShopPage allarts={allarts}></AllArtsShopPage>
        </div>
    );
};

export default ArtCartPage;