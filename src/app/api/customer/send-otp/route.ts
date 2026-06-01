import { sendOTP } from "@/actions/sendOTP";
import { connectDb } from "@/libs/ConnectDb";
import { withErrorHandler } from "@/libs/withErrorHandler";
import customerModel from "@/models/customer.model";
import { customerSchema } from "@/schema/customer.schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandler(async (req:NextRequest) =>{
    await connectDb()
    const body = await req.json()
    const result = customerSchema.safeParse(body)
    if(!result.success){
        return NextResponse.json({
            success:false,
            message:result.error.issues[0].message
        },{status:400})
    }
    const {email,phoneNumber,customerName,dob} = result.data
    const customer = await customerModel.findOne({email})
    const otp = Math.floor(1000 + Math.random()* 9000)
    const otpExpiry = new Date(Date.now() + 1000 * 60 * 10) 
    if(!customer){
        await  customerModel.create({
         email,
         phoneNumber,
         customerName,
         dob,
         otp,
         otpExpiry
       })
    }else {
        customer.phoneNumber = phoneNumber
        customer.dob = dob
        customer.customerName = customerName
        customer.otp = otp 
        customer.otpExpiry = new Date(otpExpiry)
        await customer.save()
    }
    await sendOTP(email,customerName,otp,otpExpiry)
    return NextResponse.json({
        success:true,
        message:"OTP send successfully",
    },{status:201})
})