import { confirmBooking } from "@/actions/confirmBooking";
import { connectDb } from "@/libs/ConnectDb";
import { OTP_MAX_ATTEMPTS, verifyOtpHash } from "@/libs/security";
import { withErrorHandler } from "@/libs/withErrorHandler";
import  bookingModel  from "@/models/booking.model";
import customerModel from "@/models/customer.model";
import  packageModel  from "@/models/package.model";
import { bookingSchema } from "@/schema/booking.schema";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const fail = (message: string, status: number) =>
    NextResponse.json({ success: false, message }, { status })

export const POST = withErrorHandler(async (req:NextRequest)=>{
    await connectDb()
    const body = await req.json()
    const result = bookingSchema.safeParse(body)
    if(!result.success){
        return fail(result.error.issues[0].message, 400)
    }
    const {email,otp,packageId,totalPersons,travelDate} = result.data

    // Validate everything that does not need the OTP first
    if(!isValidObjectId(packageId)){
        return fail("Package not found", 404)
    }
    const pck = await packageModel.findById(packageId)
    if(!pck){
        return fail("Package not found", 404)
    }
    const travel = new Date(travelDate)
    const today = new Date()
    today.setHours(0,0,0,0)
    if(travel < today){
        return fail("Travel date cannot be in the past", 400)
    }

    // OTP checks
    const customer = await customerModel.findOne({email})
    if(!customer || !customer.otp || !customer.otpExpiry){
        return fail("No OTP found for this email. Please request a new one.", 404)
    }
    if(new Date() > customer.otpExpiry){
        return fail("OTP expired. Please request a new one.", 400)
    }
    if((customer.otpAttempts ?? 0) >= OTP_MAX_ATTEMPTS){
        // Burn the OTP: the customer has to request a fresh one
        customer.otp = null
        customer.otpExpiry = null
        await customer.save()
        return fail("Too many incorrect attempts. Please request a new OTP.", 429)
    }
    if(!verifyOtpHash(email, otp, customer.otp)){
        customer.otpAttempts = (customer.otpAttempts ?? 0) + 1
        await customer.save()
        return fail("Invalid OTP", 400)
    }

    // OTP is valid: consume it and create the booking
    customer.isVerified = true
    customer.otp = null
    customer.otpExpiry = null
    customer.otpAttempts = 0
    await customer.save()

    // Price and destination come from the package record, never from the browser
    const totalPrice = pck.price * totalPersons
    await bookingModel.create({
        customerId: customer._id,
        packageId: pck._id,
        destinationId: pck.destinationId,
        totalPersons,
        travelDate: travel,
        totalPrice
    })
    try {
        await confirmBooking(customer.customerName,pck.title,customer.email)
    } catch (mailError) {
        // The booking is saved; don't report a failure just because the email failed
        console.error("Booking confirmation email failed:", mailError)
    }
    return NextResponse.json({
        success:true,
        message:"Booking confirmed successfully"
    },{status:201})
})
