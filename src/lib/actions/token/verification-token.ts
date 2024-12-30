import { VerificationToken } from "@/model/verificationToken.model";


export const getVerificationTokenByToken = async(token : string) =>{
    try {
        const verificationToken = await VerificationToken.findOne({token : token})
        return verificationToken;
        
    } catch (error) {
        return null;
        
    }
}

export const getVerificationTokenByEmail = async(email : String) =>{
    try {
        const verificationToken = await VerificationToken.findOne({
          email  
        })
        return verificationToken;
    } catch (error) {
        return null;
        
    }

}

