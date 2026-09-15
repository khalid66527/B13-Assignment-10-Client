import { serverMutation, serverPut, serverDelete } from "../core/server";

export const addToCartAction = async (cartData) => {
  return serverMutation("/api/cart", cartData);
};

export const updateCartQtyAction = async (id, quantity) => {
  return serverPut(`/api/cart/${id}`, { quantity });
};

export const removeCartItemAction = async (id) => {
  return serverDelete(`/api/cart/${id}`);
};

export const clearUserCartAction = async (email, userId) => {
  const params = new URLSearchParams();
  if (email) params.append("email", email);
  if (userId) params.append("userId", userId);
  return serverDelete(`/api/cart/clear/all?${params.toString()}`);
};
