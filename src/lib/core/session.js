import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export const getUserSession = async () => {

    // calling get session on the server
    const session = await auth.api.getSession({
        headers: await headers() // some endpoints might require headers
    })
    return session?.user || null

}




export const artistRole = async (role) => {
    const user = await getUserSession()
    if (!user) {
        redirect('/auth/signin')
    }
    if (user.role !== role){
        redirect('/unauthorized')
        }
        return user;

}



export const adminRole = async (role) => {
    const user = await getUserSession()
    if (!user) {
        redirect('/auth/signin')
    }
    if (user.role !== role){
        redirect('/unauthorized')
        }
        return user;

}



export const userRole = async (role) => {
    const user = await getUserSession()
    if (!user) {
        redirect('/auth/signin')
    }
    if (user.role !== role){
        return redirect('/unauthorized')
        }

        return user
}