import { serverFetch } from "../core/server";

export const getAllPurchases = async () => {
  return await serverFetch("/api/purchases");
};
