import { connectDb } from "@/libs/ConnectDb";
import adminModel from "@/models/admin.model";
import bcrypt from "bcryptjs";
import type { User,NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions:NextAuthOptions = {
    providers:[
      CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
              identifier: {type: "text",placeholder:"Email"},
              password: { type: "password",placeholder:"Password"}
        },
        async authorize(credentials: Record<"identifier" | "password", string> | undefined):Promise<User | null>{
          await connectDb()
          try {
            if(!credentials || !credentials?.identifier || !credentials.password){
                throw Error("Please enter a email or password")
            }
            const admin = await adminModel.findOne({email:credentials?.identifier})
            if(!admin){
                throw new Error("Admin not found ")
            }
            const isPasswordCorrect = await bcrypt.compare(credentials?.password,admin?.password)
            if(!isPasswordCorrect){
                throw new Error("Invalid Password")
            }
            return {
            id: admin._id.toString(), 
            adminName: admin.adminName,
            email: admin.email,
            };
          } catch (error:unknown) {
            if(error instanceof Error){
                throw new Error(error.message)
            }else{
                throw new Error("Something went wrong")
            }
          }
        }
      }) 
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
             const dbAdmin = await adminModel.findOne({email:user.email})
            if(dbAdmin){
                token._id = dbAdmin.id.toString();
                token.adminName = dbAdmin.adminName;
                token.email = dbAdmin.email;
            }
            }
            return token
        },
        async session({session,token}){
            if(session.user){
                session.user = {
                    _id: token?._id as string,
                    adminName : token?.adminName as string,
                    email : token?.email as string
                }
            }
            return session
        }
    },
    pages:{
        signIn:"/sign-in"
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.JWT_SECRET_KEY
}