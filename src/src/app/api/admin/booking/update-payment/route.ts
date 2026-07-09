import { withHandler } from "@/libs/withHandler"
import bookingModel from "@/models/booking.model"
import { NextRequest, NextResponse } from "next/server"

export const PUT = withHandler(async (req:NextRequest,user)=>{
    const {bookingId,paymentStatus} = await req.json()
    if(!bookingId || !paymentStatus){
        return NextResponse.json({
            success:false,
            message:"Booking id or payment status is missing"
        },{status:400})
    }
    const allowedStatuses = ["Pending", "Completed"];

    if(!allowedStatuses.includes(paymentStatus)) {
    return NextResponse.json({
        success: false,
        message: "Invalid booking status",
      },{ status: 400 })}
    const booking =  await bookingModel.findByIdAndUpdate(bookingId,{
     paymentStatus
    },{new:true})
    if (!booking) {
    return NextResponse.json({
        success: false,
        message: "Booking not found",
    },{ status: 404 })}
    return NextResponse.json({
        success:true,
        message:"Payment status updated successfully"
    },{status:200})
})