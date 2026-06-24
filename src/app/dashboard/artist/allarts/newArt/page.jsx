import React from 'react';
import NewArtPostForm from './NewArtPostForm';
import { getLoggedInUserCompany } from '@/lib/api/companies.server';
import { getUserSession } from '@/lib/core/session';

const PostArtPage = async () => {

    const company = await getLoggedInUserCompany()
    const user  = await getUserSession()
    console.log('user data :', user);
    return (
        <div>
            <NewArtPostForm user={user} company={company}></NewArtPostForm>
        </div>
    );
};

export default PostArtPage;