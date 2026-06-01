import { withHandler } from "@/libs/withHandler"
import { packageSchema } from "@/schema/package.schema"
import { NextRequest, NextResponse } from "next/server"
import { CloudinaryResult, deleteFromCloudinary, uploadOnCloudinary } from "@/libs/cloudinary";
import { packageModel } from "@/models/package.model";
import {  Types } from "mongoose";
import { destinationModel } from "@/models/destination.model";
import { withErrorHandler } from "@/libs/withErrorHandler"
export const POST = withHandler(async (req:NextRequest,user) => {
    const formData = await req.formData()
    const obj = {
    destinationId: formData.get("destinationId"),
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    slots: formData.get("slots"),
    duration: formData.get("duration"),
    includedService: formData.getAll("includedService"),
    excludedService: formData.getAll("excludedService"),
    packageImages : formData.getAll("packageImages") 
    .filter((item): item is File => item instanceof File)
    }
    const result = await packageSchema.safeParse(obj)
    if(!result.success || result.error){
        return NextResponse.json({
        succcess:false,
        message:result.error.issues[0].message
       },{status:400})
    }
    const {destinationId,title,description,price,slots,duration,
    includedService,excludedService,packageImages} = result.data
    const destination = await destinationModel.findById(destinationId)
    if(!destination){
        return NextResponse.json({
        succcess:false,
        message:"Destination id not found"
       },{status:404})
    }
    const images: CloudinaryResult[] = await Promise.all(
    packageImages.map((image) =>
       uploadOnCloudinary(image, "packages")
    ))
    await packageModel.create({
        destinationId:new Types.ObjectId(destinationId),
        title,
        description,
        price,
        slots,
        duration,
        includedService,
        excludedService,
        packageImages:images
    })
    return NextResponse.json({
        succcess:true,
        message:"Package Uploaded successfully"
    },{status:201})
}) 
export const GET = withErrorHandler(async (req:NextRequest)=>{
    const packages = await packageModel.find()
    if(!packages.length){
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
export const DELETE = withHandler(async (req:NextRequest)=>{
    const {packageId} = await req.json()
    if(!packageId){
        return NextResponse.json({
            success:false,
            message:"Package iD is missing"
        },{status:400})
    }

    const dbPackage = await packageModel.findById(packageId)
    if(!dbPackage){
        return NextResponse.json({
            success:false,
            message:"Package not found"
        },{status:404})
    }
    await Promise.allSettled(
        dbPackage.packageImages.map(async (img)=>(
            await deleteFromCloudinary(img.public_id!)
        ))
    )
    await dbPackage.deleteOne()
    return NextResponse.json({
        success:true,
        message:"Package deleted successfully"
    })
})