import { serverFetch } from "../core/server";

export const getAllSubscriptions = async () => {
  return await serverFetch("/api/subscriptions");
};
