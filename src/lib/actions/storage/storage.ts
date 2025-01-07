"use server"

import { auth } from "@/auth";
import { connectDB } from "@/lib/connectDB"
import { Storage } from "@/model/storage.model";

connectDB();


export const createStorage = async(data : any) =>{
    const session = await auth();
    if(!session?.user) throw new Error("Unauthorized")
    const new_storage  = await new Storage(data);
    const save_storage = await new_storage.save();
    if(!save_storage){
        return {
            error : "failed to create image"
        }
    };
    return {
        message : "SuccessFully created storage",
        storage : JSON.stringify(save_storage)
    }
    

}

