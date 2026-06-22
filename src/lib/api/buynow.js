import { serverFetch } from "../core/server"

export const getBuynowByBuynower = async(buynowerId)=>{
    return serverFetch(`/api/artbuynowstore?buynowerId?=${buynowerId}`)
}