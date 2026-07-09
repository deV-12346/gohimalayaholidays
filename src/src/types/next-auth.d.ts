import NextAuth, { DefaultSession } from "next-auth";
declare module "next-auth"{
      export interface User {
            _id?:string;
            adminName?:string;
            email?:string;
      }
      interface Session {
            user:{
            _id?:string;
            adminName?:string;
            email?:string;
            }& DefaultSession["user"]
      }
}
declare module "next-auth/jwt"{
      interface JWT{
      _id?:string;
      adminName?:string;
      email?:string;
      }
}