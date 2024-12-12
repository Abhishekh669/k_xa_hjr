import {Resend} from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)


// export const sendVerificationEmail = async (email : string, token: string) =>{
//     const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
//     console.log("i am in the mail man ",email, token)
//     const response = await resend.emails.send({
//         from : "onboarding@resend.dev",
//         to : email,
//         subject : "confrim your eamil",
//         html : `<p>click <a href=${confirmLink}> here to confirm email. </p>`
//     });
//     console.log("this is the respone of the mail : ",response)
// }




import nodemailer from "nodemailer"


export async function sendVerificationEmail({to, name, token
} : {to:string, name:string,  token:string}){
    console.log("thisi sthe token: ",token)

    const {SMTP_PASSWORD, SMTP_EMAIL} = process.env
    const transport = nodemailer.createTransport({
        
        service : "gmail",
        secure: true,
        port : 465 ,
        auth : {
            user : SMTP_EMAIL,
            pass : SMTP_PASSWORD
        }
    })
   
        const testResult = await transport.verify()
        
   
    try {
        const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
        console.log("this is the confirm LInk : ",confirmLink)
        const subject = "Confirmation Link"
        const body = `
                <div>
                    <div>Dear <h5>${name}</h5></div>
                    <div>Please click <a href=${confirmLink}>here</a> to confirm </div>
                </div>
                `;
        const sendRequest  = await transport.sendMail({
            from : SMTP_EMAIL,
            to , subject, html : body,
        })
        console.log("sendREsult : ", sendRequest)
    } catch (error) {
        console.log(error)
        
    }
}