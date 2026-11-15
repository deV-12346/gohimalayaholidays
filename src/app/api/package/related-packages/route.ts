import { connectDb } from "@/libs/ConnectDb"
import { withErrorHandler } from "@/libs/withErrorHandler"
import packageModel from "@/models/package.model"
import destinationModel from "@/models/destination.model"
import { isValidObjectId } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

// Referenced so the Destination model is registered before populate() runs
void destinationModel

export const GET = withErrorHandler(async(req:NextRequest)=>{
    await connectDb()
    const { searchParams } = new URL(req.url);
    const destinationId = searchParams.get("destinationId");
    const packageId = searchParams.get("packageId");
    if(!destinationId || !packageId || !isValidObjectId(destinationId) || !isValidObjectId(packageId)){
        return NextResponse.json({
            success:false,
            message:"Invalid destination or package id"
        },{status:400})
    }
    // Exclude the current package in the query itself, then take 5
    const packages = await packageModel
        .find({destinationId, _id: { $ne: packageId }})
        .limit(5)
        .populate("destinationId", "title description destinationLocation")
    return NextResponse.json({
        success:true,
        message:"Related Packages fetched",
        packages
    },{status:200})
})
