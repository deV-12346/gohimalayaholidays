import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req:NextRequest){
    const token = await getToken({req,secret:process.env.JWT_SECRET_KEY})
    console.log(token)
    const url = req.nextUrl
    if(token && (url.pathname.startsWith("/sign-in"))){ // if user already logged in 
      return NextResponse.redirect(new URL("/admin/dashboard",req.url))
    }else if(!token && url.pathname.startsWith("/admin")){ //admin already logged out and no token redirect to sign-in 
      return NextResponse.redirect(new URL("/sign-in",req.url))
    }
}
export const config = {
    matcher: [
    '/admin/:path*',
    '/sign-in',
    ]
}