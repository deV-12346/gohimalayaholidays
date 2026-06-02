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
export const PATCH = withHandler(async (req:NextRequest, user) => {
    const formData = await req.formData()
    const packageId = formData.get("packageId") as string
    
    if(!packageId){
        return NextResponse.json({
            success:false,
            message:"Package ID is missing"
        },{status:400})
    }

    const dbPackage = await packageModel.findById(packageId)
    if(!dbPackage){
        return NextResponse.json({
            success:false,
            message:"Package not found"
        },{status:404})
    }

    const destinationId = formData.get("destinationId") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = Number(formData.get("price"))
    const slots = Number(formData.get("slots"))
    const duration = Number(formData.get("duration"))
    const includedService = JSON.parse(formData.get("includedService") as string)
    const excludedService = JSON.parse(formData.get("excludedService") as string)
    const newImages = formData.getAll("packageImages").filter((item): item is File => item instanceof File)

    // Validate destination
    if(destinationId){
        const destination = await destinationModel.findById(destinationId)
        if(!destination){
            return NextResponse.json({
                success:false,
                message:"Destination not found"
            },{status:404})
        }
    }

    // Upload new images if provided
    let updatedImages = dbPackage.packageImages
    if(newImages.length > 0){
        // Delete old images from cloudinary
        await Promise.allSettled(
            dbPackage.packageImages.map(async (img)=>(
                await deleteFromCloudinary(img.public_id!)
            ))
        )
        // Upload new images
        const images: CloudinaryResult[] = await Promise.all(
            newImages.map((image) => uploadOnCloudinary(image, "packages"))
        )
        updatedImages = images
    }

    // Update package
    dbPackage.destinationId = destinationId ? new Types.ObjectId(destinationId) : dbPackage.destinationId
    dbPackage.title = title || dbPackage.title
    dbPackage.description = description || dbPackage.description
    dbPackage.price = price || dbPackage.price
    dbPackage.slots = slots || dbPackage.slots
    dbPackage.duration = duration || dbPackage.duration
    dbPackage.includedService = includedService || dbPackage.includedService
    dbPackage.excludedService = excludedService || dbPackage.excludedService
    dbPackage.packageImages = updatedImages

    await dbPackage.save()

    return NextResponse.json({
        success:true,
        message:"Package updated successfully"
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