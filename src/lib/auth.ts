"use server"

import { auth } from "@/auth";


export const getUser = async()=>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized")
    return true;
}