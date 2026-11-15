import { withHandler } from "@/libs/withHandler"
import { packageSchema,editPackageSchema } from "@/schema/package.schema"
import { NextRequest, NextResponse } from "next/server"
import { CloudinaryResult, deleteFromCloudinary, uploadOnCloudinary } from "@/libs/cloudinary";
import { packageModel } from "@/models/package.model";
import {  Types } from "mongoose";
import { withErrorHandler } from "@/libs/withErrorHandler"
import { pagination } from "@/libs/pagination";
import { connectDb } from "@/libs/ConnectDb";
import destinationModel from "@/models/destination.model";
import { escapeRegex } from "@/libs/security";
import bookingModel from "@/models/booking.model";
export const POST = withHandler(async (req:NextRequest,user) => {
    await connectDb()
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
    placesCovered : formData.getAll("placesCovered"),
    packageImages : formData.getAll("packageImages")
    .filter((item): item is File => item instanceof File)
    }
    let itineraryRaw =  formData.getAll("itinerary")
    const  itineraries = itineraryRaw.map((item)=>  typeof item === "string" ? JSON.parse(item) : item)
    const result = await packageSchema.safeParse({itinerary:itineraries,...obj})
    if(!result.success || result.error){
        return NextResponse.json({
        success:false,
        message:result.error.issues[0].message
       },{status:400})
    }
    const {destinationId,title,description,price,slots,duration,
    includedService,excludedService,packageImages,placesCovered,itinerary} = result.data
    const destination = await destinationModel.findById(destinationId)
    if(!destination){
        return NextResponse.json({
        success:false,
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
        price:Number(price),
        slots:Number(slots),
        duration:Number(duration),
        includedService,
        excludedService,
        packageImages:images,
        placesCovered,
        itinerary
    })
    return NextResponse.json({
        success:true,
        message:"Package Uploaded successfully"
    },{status:201})
}) 
export const GET = withErrorHandler(async (req:NextRequest)=>{
    await connectDb()
    const searchParams = req.nextUrl.searchParams
    const page = Number(searchParams.get("page")) || 1
    const rowPerPage = Math.min(Number(searchParams.get("limit")) || 10, 100)
    const search = escapeRegex(searchParams.get("search") || "")
    const {limit,offset} = pagination(page,rowPerPage)
        const filter = {
             $or: [
                {
                title: {
                  $regex: search,
                  $options: "i",
                },
              },
              {
                description: {     
                $regex: search,
                $options: "i",
                },
              },
            ],
    }
    const totalCount = await packageModel.countDocuments(filter)
    const packages = await packageModel.find(filter)
    .populate("destinationId", "destinationLocation title")
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });
    if(!packages.length){
        return NextResponse.json({
            success:false,
            message:"Package not found"
        },{status:404})
    }
    return NextResponse.json({
     success:true,
     message:"Packages fecthed successfully",
     packages,
     totalCount
    })
})
export const PATCH = withHandler(async (req:NextRequest, user) => {
    await connectDb()
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
    const price = formData.get("price")
    const slots =  formData.get("slots")
    const duration = formData.get("duration")
    const includedService= formData.getAll("includedService")  as string[]
    const excludedService= formData.getAll("excludedService") as string[]
    const placesCovered = formData.getAll("placesCovered") as string[]
    const packageImages = formData.getAll("packageImages").filter((item): item is File => item instanceof File)
    let itineraryRaw =  formData.getAll("itinerary")
    const  itinerary = itineraryRaw.map((item)=>  typeof item === "string" ? JSON.parse(item) : item)
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
    let pendingOldImages: typeof dbPackage.packageImages = []
    const result = editPackageSchema.safeParse({destinationId,title,description,price,slots,duration,includedService,excludedService,packageImages,itinerary,placesCovered})
    if(!result.success || result.error){
        return NextResponse.json({
        success:false,
        message:result.error.issues[0].message
       },{status:400})
    }
    if(packageImages.length > 0){
        // Upload the new images FIRST so a failed upload never leaves the package without images
        const images: CloudinaryResult[] = await Promise.all(
            packageImages.map((image) => uploadOnCloudinary(image, "packages"))
        )
        // The old images are removed only after the package is saved (see below)
        pendingOldImages = dbPackage.packageImages
        updatedImages = images
    }
    // Update package
    dbPackage.destinationId = destinationId ? new Types.ObjectId(destinationId) : dbPackage.destinationId
    dbPackage.title = title || dbPackage.title
    dbPackage.description = description || dbPackage.description
    dbPackage.price = Number(price) || dbPackage.price
    dbPackage.slots = Number(slots) || dbPackage.slots
    dbPackage.duration = Number(duration) || dbPackage.duration
    dbPackage.includedService = includedService || dbPackage.includedService
    dbPackage.excludedService = excludedService || dbPackage.excludedService
    dbPackage.packageImages = updatedImages
    dbPackage.placesCovered = placesCovered || dbPackage.placesCovered
    dbPackage.itinerary = itinerary || dbPackage.itinerary
    await dbPackage.save()
    // Saved successfully: now it is safe to remove the replaced images
    await Promise.allSettled(
        pendingOldImages.map((img) => deleteFromCloudinary(img.public_id!))
    )

    return NextResponse.json({
        success:true,
        message:"Package updated successfully"
    })
})

export const DELETE = withHandler(async (req:NextRequest)=>{
    await connectDb()
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
    // Don't orphan bookings that point at this package
    const bookingCount = await bookingModel.countDocuments({packageId: dbPackage._id})
    if(bookingCount > 0){
        return NextResponse.json({
            success:false,
            message:`Cannot delete: this package has ${bookingCount} booking(s). Cancel or remove them first.`
        },{status:409})
    }
    await dbPackage.deleteOne()
    await Promise.allSettled(
        dbPackage.packageImages.map((img)=> deleteFromCloudinary(img.public_id!))
    )
    return NextResponse.json({
        success:true,
        message:"Package deleted successfully"
    })
})