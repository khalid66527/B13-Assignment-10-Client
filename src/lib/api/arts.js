'use client'

const baseUrl = process.env.NEXT_PUBLIC_URL;

export const getCompanyArts = async () =>{
    const res = await fetch (`${baseUrl}/api/arts`)
    return res.json()
}