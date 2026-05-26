import { connectDb } from "@/libs/ConnectDb";
import adminModel from "@/models/admin.model";
import { adminSchema } from "@/schema/admin.schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { createAdminAccount } from "@/actions/createAdmin.mail";
import mongoose from "mongoose"
export async function POST(req:NextRequest){
    await connectDb()
    const session = await mongoose.startSession()
    try {
        const body = await req.json()
        const result = adminSchema.safeParse(body)
        console.log(result)
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
        session.startTransaction()
        const hashedPassword = await bcrypt.hash(password,10)
        await adminModel.create([{
            adminName,
            email,
            phoneNumber:Number(phoneNumber),
            password:hashedPassword
        }],{session})
        await createAdminAccount(adminName,email,password)
        await session.commitTransaction()
        return NextResponse.json({
            success:true,
            message:"Admin created successfully"
        },{status:201})
    } catch (error) {
        if (session.inTransaction()) {
        await session.abortTransaction();
        }
        return NextResponse.json({
            success:false,
            message:"Something went wrong"
        },{status:500})
    }finally{
        session.endSession()
    }
}