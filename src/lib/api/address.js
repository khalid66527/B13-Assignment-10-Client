import { serverFetch } from "../core/server";
import { addUserAddress, updateUserAddress, setDefaultAddress, deleteUserAddress } from "../actions/address";

export const getUserAddresses = async (email, userId) => {
  let query = "";
  if (email) query += `email=${encodeURIComponent(email.trim())}`;
  if (userId) query += `${query ? "&" : ""}userId=${encodeURIComponent(userId)}`;
  const data = await serverFetch(`/api/useraddress${query ? `?${query}` : ""}`);
  return Array.isArray(data) ? data : [];
};

export const getUserAddressById = async (id) => {
  const data = await serverFetch(`/api/useraddress/${id}`);
  return data || null;
};

// Re-export actions for easy access if needed
export { addUserAddress, updateUserAddress, setDefaultAddress, deleteUserAddress };
