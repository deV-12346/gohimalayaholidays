import { confirmBooking } from "@/actions/confirmBooking";
import { connectDb } from "@/libs/ConnectDb";
import { withErrorHandler } from "@/libs/withErrorHandler";
import  bookingModel  from "@/models/booking.model";
import customerModel from "@/models/customer.model";
import  packageModel  from "@/models/package.model";
import { bookingSchema } from "@/schema/booking.schema";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandler(async (req:NextRequest)=>{
    await connectDb()
    const body = await req.json()
    const result = bookingSchema.safeParse(body)
    console.log(result)
    if(!result.success){
        return NextResponse.json({
            success:false,
            message:result.error.issues[0].message
        },{status:400})
    }
    const {email,otp,packageId,destinationId,totalPersons,travelDate,totalPrice} = result.data
    const customer = await customerModel.findOne({email})
    if(!customer || !customer.otpExpiry){
        return NextResponse.json({
            success:false,
            message:"Email not found"
        },{status:404})
    }
    const now = new Date(Date.now())
    if(now > customer.otpExpiry){
        return NextResponse.json({
            success:false,
            message:"OTP expired"
        },{status:400})
    }
    if(Number(otp) !== customer.otp){
         return NextResponse.json({
            success:false,
            message:"Invalid OTP"
        },{status:400})
    }
    customer.isVerified = true
    customer.otp =null
    customer.otpExpiry = null
    await customer.save()
    const pck = await packageModel.findById(packageId)
    if(!pck){
        return NextResponse.json({
            success:true,
            message:"Package not found"
        })
    }
    const booking = await bookingModel.create({
        customerId: new Types.ObjectId(customer._id),
        packageId,
        destinationId,
        totalPersons,
        travelDate,
        totalPrice
    })
    await confirmBooking(customer.customerName,pck.title,customer.email)
    return NextResponse.json({
        success:true,
        message:"Booking confirmed successfully"
    })
})