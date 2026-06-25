import { serverFetch } from "../core/server"


export const getArtistCompany = async (userId) => {
 return  serverFetch(`/api/my/companies?userId=${userId}`)
}

export const getAllCompanies = async () => {
  return serverFetch('/api/my/companies')
}