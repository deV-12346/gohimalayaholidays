import { connectDb } from "@/libs/ConnectDb";
import { pagination } from "@/libs/pagination";
import { withHandler } from "@/libs/withHandler";
import bookingModel from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";
import customerModel from "@/models/customer.model";
import destinationModel from "@/models/destination.model";
import packageModel from "@/models/package.model";
import mongoose from "mongoose";
console.log(destinationModel.modelName);
console.log(packageModel.modelName);
export const GET = withHandler(async (req:NextRequest,user)=>{
    await connectDb()
    console.log(mongoose.modelNames());
    const destination = await destinationModel.findById(
  "6a2034b1ed61d6bba318cab5"
);

console.log(destination);
    const searchParams = req.nextUrl.searchParams
    const page = Number(searchParams.get("page")) || 1
    const rowPerPage = Number(searchParams.get("limit")) || 10
    const search = searchParams.get("search") || ""
    const {limit,offset} = pagination(page,rowPerPage)
    let filter = {};
     if (search) {
    const customers = await customerModel.find({
      $or: [
        {
          customerName: {
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
    });
    const customerIds = customers.map((c) => c._id);
    filter = {
      customerId: {
        $in: customerIds,
      },
    };
  }
    const totalCount = await bookingModel.countDocuments(filter)
    const bookings = await bookingModel.find(filter)
    .populate("customerId", "customerName email phoneNumber")
    .populate("destinationId", "title destinationLocation")
    .populate("packageId", "title price")
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });;
    console.log("bookings",bookings)
    if(bookings.length === 0){
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
