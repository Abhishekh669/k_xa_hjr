"use server"


import { auth } from "@/auth"
import { utapi } from "@/lib/actions/uploadthing";



export const deleteImage = async(key : string) =>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized")
    try {
        const res = await utapi.deleteFiles(key);
        if(!res.success){return {error : "Failed to delete key"}}
        return {
            message : "SuccessFully deleted",

        }
    } catch (error) {
        console.log("Failed to delete key")
        return {
            error : "Failed to delete image"
        }
        
    }

}



