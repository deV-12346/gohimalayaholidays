import { connectDb } from "@/libs/ConnectDb";
import adminModel from "@/models/admin.model";
import { adminSchema } from "@/schema/admin.schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { createAdminAccount } from "@/actions/createAdmin.mail";
import { withHandler } from "@/libs/withHandler";
// Only a signed-in admin may create another admin
export const POST = withHandler(async (req:NextRequest)=>{
    await connectDb()
    const body = await req.json()
    const result = adminSchema.safeParse(body)
    if(!result.success){
        return NextResponse.json({
            success:false,
            message:result.error.issues[0].message
        },{status:400})
    }
    const {adminName,email,phoneNumber,password} = result.data
    const isExistingAdmin = await adminModel.findOne({
        $or: [
        {email },
        {phoneNumber:Number(phoneNumber)}
         ]
    })
    if(isExistingAdmin){
        return NextResponse.json({
            success:false,
            message:"Email or Mobile Number already exists"
        },{status:409})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    // No database transaction: it needs a replica set, and an email send
    // cannot be rolled back anyway.
    await adminModel.create({
        adminName,
        email,
        phoneNumber:Number(phoneNumber),
        password:hashedPassword
    })
    // The account exists now; a mail failure must not hide that.
    try {
        await createAdminAccount(adminName,email,password)
    } catch (mailError) {
        console.error("Admin welcome email failed:", mailError)
        return NextResponse.json({
            success:true,
            message:"Admin created, but the welcome email could not be sent. Share the credentials manually."
        },{status:201})
    }
    return NextResponse.json({
        success:true,
        message:"Admin created successfully"
    },{status:201})
})
