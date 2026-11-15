import { connectDb } from "@/libs/ConnectDb";
import { withErrorHandler } from "@/libs/withErrorHandler";
import packageModel from "@/models/package.model";
import destinationModel from "@/models/destination.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Referenced so the Destination model is registered before populate() runs
void destinationModel

export const GET = withErrorHandler(async (req:NextRequest,{params,}: {
      params: Promise<{
        id: string;
      }>;
    })=>{
    await connectDb()

    const {id: packageId} = await params
    if(!packageId || !isValidObjectId(packageId)){
        return NextResponse.json({
            success:false,
            message:"Package not found"
        },{status:404})
    }
    const packages = await packageModel.findById(packageId).populate("destinationId", "title description destinationLocation")
    if(!packages){
        return NextResponse.json({
            success:false,
            message:"Package not found"
        },{status:404})
    }
    return NextResponse.json({
     success:true,
     message:"Packages fetched successfully",
     packages
    })
})
