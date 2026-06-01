import { connectDb } from "@/libs/ConnectDb";
import { withHandler } from "@/libs/withHandler";
import bookingModel from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = withHandler(async (req:NextRequest,user)=>{
    await connectDb()
    const bookings = await bookingModel.find()
    .populate("customerId", "customerName email phoneNumber")
    .populate("destinationId", "title destinationLocation")
    .populate("packageId", "title price");
    if(!bookings){
        return NextResponse.json({
            success:false,
            message:"Booking not found"
        })
    }
    return NextResponse.json({
        success:true,
        message:"Booking Success",
        bookings
    })
})
