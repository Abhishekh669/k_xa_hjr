"use server"

import { User } from "@/model/user.model";
import { getVerificationTokenByToken } from "./verification-token"
import { VerificationToken } from "@/model/verificationToken.model";


export const newVerification = async(token : string)=>{
    const existingToken = await getVerificationTokenByToken(token);
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
   const updateUser =  await User.findByIdAndUpdate(
        {_id : existingUser._id}, {emailVerified : new Date(), email : existingUser.email},{new : true}
    )

    await VerificationToken.findByIdAndDelete({_id : existingToken._id})
    return {success : "Email verified!"}
}