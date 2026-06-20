import React from 'react';
import CompanyProfile from './CompanyProfile';
import { getUserSession } from '@/lib/core/session';
import { getArtistCompany } from '@/lib/api/companies';

const CompanyPage = async () => {
    const userData = await getUserSession();
    

    const artistCompany = await getArtistCompany(userData?.id);

    console.log("userData", userData);
    console.log("Company data", artistCompany);


    return (
        <div>
            <CompanyProfile
                userData={userData}
                artistCompany={artistCompany}
            />
        </div>
    );
};

export default CompanyPage;