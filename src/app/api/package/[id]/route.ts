import { connectDb } from "@/libs/ConnectDb";
import { withErrorHandler } from "@/libs/withErrorHandler";
import { destinationModel } from "@/models/destination.model";
import packageModel from "@/models/package.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = withErrorHandler(async (req:NextRequest,{params,}: {
      params: {
        id: string;
      };
    })=>{
    await connectDb()

    const {id} = await params
    const packageId = id
    if(!packageId){
        return NextResponse.json({
            success:false,
            message:"Package ID is missing"
        },{status:404})
    }
    const packages = await packageModel.findById(packageId)
    if(!packages){
        return NextResponse.json({
            success:false,
            message:"Package not found"
        },{status:404})
    }
    return NextResponse.json({
     success:true,
     message:"Packages fecthed successfully",
     packages
    })
})