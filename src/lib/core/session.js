import { betterAuth } from "better-auth";
import { headers } from "next/headers";
import { auth } from "../auth";

export const getUserSession = async()=>{

    // calling get session on the server
    const session = await auth.api.getSession({
        headers: await headers() // some endpoints might require headers
    })
    return session?. user || null


    
}
