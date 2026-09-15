const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";

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

export const serverFetch = async (path) => {
    try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${baseUrl}${path}`, {
            cache: 'no-store',
            headers: {
                ...authHeaders
            }
        });
        if (!res.ok) {
            return null;
        }
        const text = await res.text();
        if (!text || text.trim().startsWith("<")) {
            return null;
        }
        return JSON.parse(text);
    } catch (e) {
        console.error(`serverFetch error on ${path}:`, e.message);
        return null;
    }
};

export const serverMutation = async (path, data, method = 'POST') => {
    try {
        const authHeaders = await getAuthHeaders();
        const options = {
            method: method,
            headers: {
                ...authHeaders
            }
        };
        if (data !== undefined && data !== null && method !== 'DELETE') {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }
        const res = await fetch(`${baseUrl}${path}`, options);
        const text = await res.text();
        if (!text || text.trim().startsWith("<")) {
            return { error: "Non-JSON response from server" };
        }
        return JSON.parse(text);
    } catch (e) {
        console.error(`serverMutation error on ${path}:`, e.message);
        return { error: e.message };
    }
};

export const serverPut = async (path, data) => serverMutation(path, data, 'PUT');
export const serverPatch = async (path, data) => serverMutation(path, data, 'PATCH');
export const serverDelete = async (path) => serverMutation(path, null, 'DELETE');