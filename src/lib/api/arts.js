
const baseUrl = process.env.NEXT_PUBLIC_URL;

export const getCompanyArts = async () =>{
    const res = await fetch (`${baseUrl}/api/arts`)
    return res.json()
}

export const getArtById = async (id) => {
    const res = await fetch(`${baseUrl}/api/arts/${id}`);
    return res.json();
}

export const updateArt = async (id, data) => {
    const res = await fetch(`${baseUrl}/api/arts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

export const deleteArt = async (id) => {
    const res = await fetch(`${baseUrl}/api/arts/${id}`, {
        method: 'DELETE'
    });
    return res.json();
}