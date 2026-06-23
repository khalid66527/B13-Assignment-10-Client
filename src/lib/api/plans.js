import { serverFetch } from "../core/server"


export const getPlanById = async (planId) => {
    const id = (planId || 'buynower_free').toLowerCase();
    return serverFetch(`/api/plans?plan_id=${id}`)
}