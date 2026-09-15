import { serverFetch } from "../core/server";

export const getPlanById = async (planId) => {
  const id = planId || 'buynower_free';
  return serverFetch(`/api/plans?plan_id=${id}`);
};

export const getUserSubscriptionByEmail = async (email) => {
  if (!email) return null;
  const subs = await serverFetch(`/api/subscriptions?email=${encodeURIComponent(email.trim())}`);
  if (!Array.isArray(subs) || subs.length === 0) return null;

  // Prioritize active Premium or Pro tier if present in user history
  const premiumSub = subs.find((s) => String(s.planId || "").toLowerCase().includes("premium"));
  if (premiumSub) return premiumSub;

  const proSub = subs.find((s) => String(s.planId || "").toLowerCase().includes("pro"));
  if (proSub) return proSub;

  return subs[0];
};

export const getFreshUserByEmail = async (email) => {
  if (!email) return null;
  return serverFetch(`/api/users/by-email?email=${encodeURIComponent(email.trim())}`);
};