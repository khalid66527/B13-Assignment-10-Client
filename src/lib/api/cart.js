const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";

export const getUserCart = async (email, userId) => {
  try {
    const params = new URLSearchParams();
    if (email) params.append("email", email);
    if (userId) params.append("userId", userId);
    
    const res = await fetch(`${baseUrl}/api/cart?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching cart from API:", error);
    return [];
  }
};

export const addToCartApi = async (data) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : "";
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${baseUrl}/api/cart`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { error: error.message };
  }
};

export const updateCartQtyApi = async (id, quantity) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : "";
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${baseUrl}/api/cart/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ quantity }),
    });
    return await res.json();
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return { error: error.message };
  }
};

export const removeCartItemApi = async (id) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : "";
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${baseUrl}/api/cart/${id}`, {
      method: "DELETE",
      headers,
    });
    return await res.json();
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { error: error.message };
  }
};

export const clearUserCartApi = async (email, userId) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : "";
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (email) params.append("email", email);
    if (userId) params.append("userId", userId);

    const res = await fetch(`${baseUrl}/api/cart/clear/all?${params.toString()}`, {
      method: "DELETE",
      headers,
    });
    return await res.json();
  } catch (error) {
    console.error("Error clearing user cart:", error);
    return { error: error.message };
  }
};
