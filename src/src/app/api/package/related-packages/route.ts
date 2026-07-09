import { withErrorHandler } from "@/libs/withErrorHandler"
import packageModel from "@/models/package.model"
import { Package } from "lucide-react"
import { NextRequest, NextResponse } from "next/server"

export const GET = withErrorHandler(async(req:NextRequest)=>{
    const { searchParams } = new URL(req.url);
    console.log(searchParams)
    const destinationId = searchParams.get("destinationId");
    const packageId = searchParams.get("packageId");
    if(!destinationId || !packageId){
        return NextResponse.json({
            success:false,
            message:"Something went wrong"
        },{status:404})
    }
    const packages = await packageModel.find({destinationId:destinationId}).limit(5).populate("destinationId", "title descrition destinationLocation")
    return NextResponse.json({
        success:true,
        message:"Related Packages fetched",
        packages
    },{status:200})
})