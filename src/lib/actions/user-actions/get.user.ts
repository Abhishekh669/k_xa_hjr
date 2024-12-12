"use server"

import { auth } from "@/auth";



export async function getLogedInUser(){
    const session = await auth();
    console.log("this is the session me for getuser : ",session)
    if(!session?.user) return null;
    return session?.user;
}