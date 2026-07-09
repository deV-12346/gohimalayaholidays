import { connectDb } from "@/libs/ConnectDb";
import { withHandler } from "@/libs/withHandler";
import bookingModel from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";
export const GET = withHandler(async (req: NextRequest, user) => {
  await connectDb()
  const [
    totalBookings,
    pendingBookings,
    completedBookings,
    cancelledBookings,
    revenueResult,
    ] = await Promise.all([
    bookingModel.countDocuments(),
    bookingModel.countDocuments({ bookingStatus: "Pending" }),
    bookingModel.countDocuments({ bookingStatus: "Completed" }),
    bookingModel.countDocuments({ bookingStatus: "Cancelled" }),
    bookingModel.aggregate([
      {
        $match: {
          bookingStatus: "Completed",
          paymentStatus: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]),
   ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    console.log(totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue)
    return NextResponse.json({
      success: true,
      data:{
        totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
      }
    },{ status: 200 });
});