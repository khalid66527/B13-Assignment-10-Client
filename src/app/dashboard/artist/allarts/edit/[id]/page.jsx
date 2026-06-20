import React from 'react';
import EditArtForm from './EditArtForm';
import { getLoggedInUserCompany } from '@/lib/api/companies.server';
import { getArtById } from '@/lib/api/arts';

const EditArtPage = async ({ params }) => {
    const { id } = await params;
    const company = await getLoggedInUserCompany();
    const art = await getArtById(id);

    return (
        <div>
            <EditArtForm company={company} art={art} id={id} />
        </div>
    );
};

export default EditArtPage;
