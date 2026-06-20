import { getUserSession } from "../core/session"
import { serverFetch } from "../core/server"


export const getArtistCompany = async (userId) => {

 return  serverFetch(`/api/my/companies?userId=${userId}`)
   
}

export const getLoggedInUserCompany = async()=>{
    const user =await getUserSession()
    return getArtistCompany(user?.id)
}