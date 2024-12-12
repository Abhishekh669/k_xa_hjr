import { v4 as uuidv4 } from "uuid"
import { getVerificationTokenByEmail } from "./actions/token/verification-token";
import { VerificationToken } from "@/model/verificationToken.model";



export const generateVerificationToken = async(email : string) =>{
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 1800 * 1000); //expires in half hour

    const existingToken = await getVerificationTokenByEmail(email);
    if(existingToken){
        await VerificationToken.findByIdAndDelete({_id : existingToken._id})
    }
    const newToken = new VerificationToken({
        email,
        token,
        expires,
      });
    const savedToken =  await newToken.save();
    return savedToken;
    
}