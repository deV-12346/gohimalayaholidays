import { sendEnquiryAdminAlert, sendEnquiryConfirmation } from "@/actions/enquiry.mail";
import { connectDb } from "@/libs/ConnectDb";
import { withErrorHandler } from "@/libs/withErrorHandler";
import { withHandler } from "@/libs/withHandler";
import adminModel from "@/models/admin.model";
import enquiryModel from "@/models/enquiry.model";
import { enquirySchema } from "@/schema/enquiey.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandler(async (req:NextRequest)=>{
    await connectDb()
    const body = await req.json()
    const result = enquirySchema.safeParse(body)
    if(!result.success){
    return NextResponse.json({
        success:false,
        message:result.error.issues[0].message
    },{status:400})
    }
    const admins = await adminModel.find()
    const newEnquiry = await enquiryModel.create(body)
    const {name,email,phoneNumber,message} = body
    await Promise.allSettled([
        sendEnquiryConfirmation(name,email,phoneNumber,message),
        ...admins.map((admin)=> sendEnquiryAdminAlert(
        name,
        email,
        admin.email,
        phoneNumber,
        message
    ))
    ])
    return NextResponse.json({
        success:true,
        message:"Our team will connect with you shortly"
    },{status:201})
})

export const GET = withErrorHandler(async (req:NextRequest)=>{
    await connectDb()
    const enquiries = await enquiryModel.find().sort({ createdAt: -1 })
    return NextResponse.json({
        success:true,
        message:"Enquiries fetched successfully",
        equiries: enquiries ?? []
    })
})