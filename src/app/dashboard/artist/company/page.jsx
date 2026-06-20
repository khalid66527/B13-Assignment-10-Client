import React from 'react';
import CompanyProfile from './CompanyProfile';
import { getUserSession } from '@/lib/core/session';
// import { getArtistCompany } from '@/lib/api/companies';

const CompanyPage = async() => {
    const userData = await getUserSession()
    // const id =await getArtistCompany()
    // console.log("object",id);
    return (
        <div>
            <CompanyProfile userData={userData}></CompanyProfile>
        </div>
    );
};

export default CompanyPage;