"use server"

import { User } from "@/model/user.model";
import { getVerificationTokenByToken } from "./verification-token"
import { VerificationToken } from "@/model/verificationToken.model";


export const newVerification = async(token : string)=>{
    const existingToken = await getVerificationTokenByToken(token);
    console.log("this is hte eisting TOken : ",existingToken)
    if(!existingToken){
        return {error : "Token does not exist"}
    }
    const hasExpired = new Date(existingToken.expires) < new Date();
    if(hasExpired){
        return {error : "Token has expired"}
    }
    const existingUser = await User.findOne({email : existingToken.email})
    if(!existingUser){
        return {error : "Email does not exist"}
    }
    console.log("I ma here",existingUser)
   const updateUser =  await User.findByIdAndUpdate(
        {_id : existingUser._id}, {emailVerified : new Date(), email : existingUser.email},{new : true}
    )
    console.log("i am here down after updateUser : ", updateUser)

    await VerificationToken.findByIdAndDelete({_id : existingToken._id})
    console.log("token have been deleted")
    return {success : "Email verified!"}
}