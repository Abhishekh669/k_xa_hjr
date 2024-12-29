'use server'
import { signIn,signOut } from "@/auth"
import { connectDB } from "@/lib/connectDB";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/token";
import { User } from "@/model/user.model";
import { AuthError } from "next-auth";

export const doCredentialLogin =    async(formData : FormData) =>{
    await connectDB();
    console.log("i am in cred loign")
    const existingUser = await User.findOne({
        $and: [
          { email: formData.get('email') },
          { authProvider: "credentials" },
        ],
      }).select("+password");
      console.log("this is the existingUser : ", existingUser)
    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error : "Email doesnot exist!"}
    }
    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail({
            to : verificationToken.email as string ,
            name : verificationToken.email as string ,
            token : verificationToken.token 
        })
        return {success : "Confirmation email sent!"}

    }
    try {
        const response = await signIn("credentials",{
            email : formData.get('email'),
            password : formData.get('password'),
            authProvider : "credentials",
            redirect : false
        });
        return response;
    } catch (error) {
        if (error instanceof AuthError){
            switch (error.type){
                case "CredentialsSignin":
                    return {error : "Invalid credentails!"}
                default : 
                    return {error : "Something went wrong "}
            }
        }
        throw error;
    }
}


export const doSocailLogin = async(formData : FormData) =>{
    const action  = formData.get('action') as string;
    await signIn(action,{redirectTo : "/slack"})
    console.log("this is the action : ", action)

}



export const doLogout = async() =>{
    console.log("this is logout")

    await signOut({
        redirectTo : "/"
    })
}