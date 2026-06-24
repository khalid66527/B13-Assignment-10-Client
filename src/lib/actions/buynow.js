import { serverMutation } from "../core/server";

export const buynowStore = async (newbuynowData)=>{
    return serverMutation('/api/artbuynowstore',newbuynowData)
}
