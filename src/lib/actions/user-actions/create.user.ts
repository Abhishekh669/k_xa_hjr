"use server"
import { connectDB } from "@/lib/connectDB";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { User } from "@/model/user.model";
import { SignUpValidation } from "@/types/user";
import { hash } from "bcryptjs";

export const createUser = async(userData : SignUpValidation) =>{
    console.log("this is the  for new userDAta ",userData)
    await connectDB();
    const checkUser = await User.findOne({
        $and: [
            { email: userData.email },
            { authProvider: userData.authProvider },
          ],
})
    if(checkUser){
        return {error : "User Already exists"};
    }
    
    const hashedPassword = await hash(userData?.password as string, 10);
    const data = {...userData, password : hashedPassword, emailVerified : null}
    console.log("this is hte new user : ",data)
    const newUser = await new User(data);
    const savedUser = await newUser.save();
    const verificationToken = await generateVerificationToken(userData.email)
    console.log("this is the verification Token : ",verificationToken)

    await sendVerificationEmail({
        to : verificationToken.email as string ,
        name : verificationToken.email as string ,
        token : verificationToken.token
    })

    // await sendVerificationEmail(verificationToken.email, verificationToken.token)
    if(!savedUser){
        return {error : "Failed to create new user"}
    }
    return {message : "Confirmation email sent", status : 200}
}