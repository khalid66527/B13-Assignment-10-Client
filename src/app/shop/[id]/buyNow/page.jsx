import React from 'react';
import BuyNowPage from './BuyNowPage';
import { getUserSession } from '@/lib/core/session';
import { getArtById } from '@/lib/api/arts';

const BuyNow = async ({ params }) => {
    const { id } = await params;
    const user = await getUserSession();
    const artworkData = await getArtById(id);
    
    return (
        <div>
           
            <BuyNowPage user={user} artwork={artworkData} id={id} />
        </div>
    );
};

export default BuyNow;