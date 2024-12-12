export interface SignUpValidation { 
    email : string,
    password ?: string,
    name : string,
    authProvider : string,
    image ?: string
}