import { connectDb } from "@/libs/ConnectDb";
import { withHandler } from "@/libs/withHandler";
import adminModel from "@/models/admin.model";
import { changePassword } from "@/schema/changepassword.schema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = withHandler(async (req:NextRequest,user)=>{
    await connectDb()
    const userid = user._id
    const body = await req.json()
    const response = await changePassword.safeParse(body)
    if(!response.success){
      return NextResponse.json({
        success:false,
        message:response.error.issues[0].message
      },{status:400})
    }
    const {newPassword} = response.data
    const euser = await adminModel.findById(userid)
     if (!euser) {
      return NextResponse.json(
        { 
            success: false, 
            message: "User not found"
        },{ status: 404});
    }
    const samePassword = await bcrypt.compare(newPassword,euser.password)
    if(samePassword){
        return NextResponse.json({
            success:false,
            message:"Old Password and New Password should not be same"
        },{status:400})
    }
    const hashedPassword = await bcrypt.hash(newPassword,10)
    await adminModel.findByIdAndUpdate(userid, {
        $set:{ password: hashedPassword },
    });
    return NextResponse.json({
        success:true,
        message:"Password changed successfully"
    })
})