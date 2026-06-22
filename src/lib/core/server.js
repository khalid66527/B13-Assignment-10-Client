const baseUrl = process.env.NEXT_PUBLIC_URL;

export const serverFetch = async(path)=>{
    const res = await fetch(`${baseUrl}${path}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

export const serverMutation = async (path, data) => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return res.json();
}