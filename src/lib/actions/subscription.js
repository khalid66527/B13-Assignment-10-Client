

import { serverMutation } from "../core/server";

export const createSubscription = async (subsInfo)=>{
    return serverMutation('/api/subscriptions',subsInfo)
}
