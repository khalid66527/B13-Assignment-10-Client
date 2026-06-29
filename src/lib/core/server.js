const baseUrl = process.env.NEXT_PUBLIC_URL;

const getAuthHeaders = async () => {
    let token = "";
    if (typeof window !== "undefined") {
        token = localStorage.getItem("jwt_token") || "";
    } else {
        try {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            token = cookieStore.get("jwt_token")?.value || "";
        } catch (e) {
            // Fail silent if cookies not available in this context
        }
    }
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const serverFetch = async(path)=>{
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${baseUrl}${path}`, {
        headers: {
            ...authHeaders
        }
    });
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

export const serverMutation = async (path, data) => {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders
        },
        body: JSON.stringify(data)
    });
    return res.json();
}