import { serverMutation, serverPut, serverPatch, serverDelete } from "../core/server";

export const addUserAddress = async (addressData) => {
  return serverMutation("/api/useraddress", addressData);
};

export const updateUserAddress = async (id, addressData) => {
  return serverPut(`/api/useraddress/${id}`, addressData);
};

export const setDefaultAddress = async (id, email, userId) => {
  return serverPatch(`/api/useraddress/${id}/default`, { userEmail: email, userId });
};

export const deleteUserAddress = async (id) => {
  return serverDelete(`/api/useraddress/${id}`);
};
