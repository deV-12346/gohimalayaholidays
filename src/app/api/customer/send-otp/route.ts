import { sendOTP } from "@/actions/sendOTP";
import { connectDb } from "@/libs/ConnectDb";
import {
    OTP_RESEND_COOLDOWN_MS,
    OTP_TTL_MS,
    generateOtp,
    hashOtp,
} from "@/libs/security";
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

    // Cooldown: stops OTP-email spam and makes brute-forcing slower
    if(customer?.lastOtpSentAt){
        const waitMs = customer.lastOtpSentAt.getTime() + OTP_RESEND_COOLDOWN_MS - Date.now()
        if(waitMs > 0){
            return NextResponse.json({
                success:false,
                message:`Please wait ${Math.ceil(waitMs / 1000)} seconds before requesting another OTP.`
            },{status:429})
        }
    }

    const otp = generateOtp()
    const otpHash = hashOtp(email, otp)
    const otpExpiry = new Date(Date.now() + OTP_TTL_MS)
    const now = new Date()

    if(!customer){
        await customerModel.create({
            email,
            phoneNumber,
            customerName,
            dob,
            otp: otpHash,
            otpExpiry,
            otpAttempts: 0,
            lastOtpSentAt: now,
        })
    }else {
        // An already-verified customer's saved details can't be overwritten by
        // someone who only knows their email address.
        if(!customer.isVerified){
            customer.phoneNumber = phoneNumber
            customer.dob = dob
            customer.customerName = customerName
        }
        customer.otp = otpHash
        customer.otpExpiry = otpExpiry
        customer.otpAttempts = 0
        customer.lastOtpSentAt = now
        await customer.save()
    }
    try {
      // Greet a verified customer by the name already on file
      await sendOTP(email, customer?.isVerified ? customer.customerName : customerName, otp, otpExpiry);
    } catch (emailError) {
      console.error("Email service failed temporarily:", emailError);
      return NextResponse.json({
        success: false,
        message: "Failed to send verification email. Please try again."
      }, { status: 503 });
    }
    return NextResponse.json({
        success:true,
        message:"OTP sent successfully",
    },{status:201})
})
