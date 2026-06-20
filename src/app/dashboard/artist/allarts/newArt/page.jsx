import React from 'react';
import NewArtPostForm from './NewArtPostForm';
import { getLoggedInUserCompany } from '@/lib/api/companies.server';

const PostArtPage = async () => {

    const company = await getLoggedInUserCompany()
    return (
        <div>
            <NewArtPostForm company={company}></NewArtPostForm>
        </div>
    );
};

export default PostArtPage;