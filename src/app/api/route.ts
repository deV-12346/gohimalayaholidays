import { connectDb } from "@/libs/ConnectDb"
import { NextResponse } from "next/server"

export async function GET(){
    await connectDb()
    try{
     return NextResponse.json({
        success:true
     },{status:200})
    }catch(err){
    }
}