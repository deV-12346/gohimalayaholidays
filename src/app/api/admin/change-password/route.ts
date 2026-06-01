import { connectDb } from "@/libs/ConnectDb";
import adminModel from "@/models/admin.model";
import { changePassword } from "@/schema/changepassword.schema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
   try {
    await connectDb()
    const body = await req.json()
    const response = await changePassword.safeParse(body)
    if(!response.success){
      return NextResponse.json({
        success:false,
        message:response.error.issues[0].message
      },{status:400})
    }
    const {newPassword} = response.data
    const user = await adminModel.findById()
     if (!user) {
      return NextResponse.json(
        { 
            success: false, 
            message: "User not found"
        },{ status: 404});
    }
    const samePassword = await bcrypt.compare(newPassword,user.password)
    if(samePassword){
        return NextResponse.json({
            success:false,
            message:"Old Password and New Password should not be same"
        },{status:400})
    }
    const hashedPassword = await bcrypt.hash(newPassword,10)
    await adminModel.findByIdAndUpdate("6a0dc4fba72d0b6c27145b8b", {
        $set:{ password: hashedPassword },
    });
    return NextResponse.json({
        success:true,
        message:"Password changed successfully"
    })
   } catch (error) {
    console.log("error",error)
    return NextResponse.json({
        success:false,
        message:"Something went wrong"
    },{status:500})
   }
}