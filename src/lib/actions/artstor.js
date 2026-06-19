"use client";

const baseUrl = process.env.NEXT_PUBLIC_URL;

export const createArt = async (newArtData) => {
    
        const res = await fetch(`${baseUrl}/api/arts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newArtData)
        });

     
        return await res.json();
    
    
}