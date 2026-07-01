import { connectDb } from "@/libs/ConnectDb";
import { pagination } from "@/libs/pagination";
import { withHandler } from "@/libs/withHandler";
import bookingModel from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = withHandler(async (req:NextRequest,user)=>{
    await connectDb()
    const searchParams = req.nextUrl.searchParams
    const page = Number(searchParams.get("page")) || 1
    const rowPerPage = Number(searchParams.get("limit")) || 10
    const search = searchParams.get("search") || ""
    const {limit,offset} = pagination(page,rowPerPage)
    const filter = {
        $or: [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            email: {     
            $regex: search,
            $options: "i",
            },
          },
        ],
      }
    const totalCount = await bookingModel.countDocuments(filter)
    const bookings = await bookingModel.find(filter)
    .populate("customerId", "customerName email phoneNumber")
    .populate("destinationId", "title destinationLocation")
    .populate("packageId", "title price")
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });;
    if(!bookings){
        return NextResponse.json({
            success:false,
            message:"Booking not found"
        })
    }
    return NextResponse.json({
        success:true,
        message:"Booking Success",
        bookings,
        totalCount
    })
})
