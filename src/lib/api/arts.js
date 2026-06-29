
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
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : "";
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${baseUrl}/api/arts/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
    });
    return res.json();
}

export const deleteArt = async (id) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : "";
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${baseUrl}/api/arts/${id}`, {
        method: 'DELETE',
        headers
    });
    return res.json();
}