
const baseUrl = process.env.NEXT_PUBLIC_URL;
export const getArtistCompany = async (userId) => {

    const res = await fetch(`${baseUrl}/api/my/companies?userId=${userId}`)
    return res.json()
}