import { serverMutation } from "../core/server";

export const updateUserRole = async (id, role) => {
  return await serverMutation(`/api/users/role/${id}`, { role });
};