import { NextRequest, NextResponse } from "next/server"
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { apiAuthPrefix, authRoute, DEFAULT_LOGIN_REIDRECT, publicRoutes } from "./route";

const {auth}  = NextAuth(authConfig);


export async function middleware(request : NextRequest){
    const  session = await auth();
    const {nextUrl} = request;
    const isAuthenticated = !!session?.user;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoute.includes(nextUrl.pathname);
    if(isApiAuthRoute){
        return null;
    }
    if(isAuthRoute){
        if(isAuthenticated){
            return Response.redirect(new URL(DEFAULT_LOGIN_REIDRECT,nextUrl))
        }
        return null;
    }

    if(!isAuthenticated && !isPublicRoute){
        return Response.redirect(new URL("/",nextUrl))
    }



   
    
    return null;
}




export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  };