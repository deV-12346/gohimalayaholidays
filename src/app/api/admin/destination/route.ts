import { destinationSchema, updateDestinationSchema } from "@/schema/destination.model";
import { NextRequest, NextResponse } from "next/server";
import { CloudinaryResult, deleteFromCloudinary, uploadOnCloudinary } from "@/libs/cloudinary";
import {  Types } from "mongoose";
import { connectDb } from "@/libs/ConnectDb";
import { withHandler } from "@/libs/withHandler";
import { withErrorHandler } from "@/libs/withErrorHandler";
import { pagination } from "@/libs/pagination";
import { escapeRegex } from "@/libs/security";
import destinationModel from "@/models/destination.model";
import packageModel from "@/models/package.model";

export const POST = withHandler(async (req:NextRequest,user) => {
        await connectDb()
        const formData = await req.formData()
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const destinationLocation = formData.get("destinationLocation") as string
        const image = formData.get('image') as File
        const popularPlacesRaw = formData.get('popularPlaces') as string

        let popularPlaces: string[] = [];
        try {
            popularPlaces = popularPlacesRaw ? JSON.parse(popularPlacesRaw) : [];
        } catch (e) {
            return NextResponse.json({
                success:false,
                message:"Invalid popular places format"
            },{status:400})
        }
        
        const result = await destinationSchema.safeParse({
            title,
            description,
            destinationLocation,
            image,
            popularPlaces
        })
        if(!result.success){
            return NextResponse.json({
                success:false,
                message:result.error.issues[0].message
            },{status:400})
        }
        const imgRes = await uploadOnCloudinary(image,'destination')
        const newDestination = await destinationModel.create({
            title,
            description,
            destinationLocation,
            image:imgRes.secure_url,
            image_public_id:imgRes.public_id,
            popularPlaces,
            uploadedBy: new Types.ObjectId(user._id)
        })
        return NextResponse.json({
            success:true,
            message:"Destination created",
            newDestination
        },{status:201})
})

export const GET = withErrorHandler(async (req:NextRequest,user) => {
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
                    destinationLocation: {     
                    $regex: search,
                    $options: "i",
                    },
                  },
                ],
              }
        const totalCount = await destinationModel.countDocuments(filter)
        const destinations = await destinationModel.find(filter).skip(offset).limit(limit).sort({ createdAt: -1 });
        if(!destinations){
            return NextResponse.json({
                success:false,
                message:"Destination not found"
            },{status:404})
        }
        return NextResponse.json({
            success:true,
            message:"Destination fetched successfully",
            destinations,
            totalCount,
        })
})
export const PATCH = withHandler(async (req:NextRequest) => {
        await connectDb()
        const formData = await req.formData()
        const id = formData.get('destinationId') as string 
        if(!id){
            return NextResponse.json({
                success:false,
                message:"Id is missing"
            },{status:400})
        }
        const title = formData.get('title') as string | null
        const description = formData.get('description') as string | null
        const destinationLocation = formData.get("destinationLocation") as string | null
        const image = formData.get('image') as File | null
        const popularPlacesRaw = formData.get('popularPlaces') as string | null
        const popularPlaces = popularPlacesRaw   ? JSON.parse(popularPlacesRaw) : []
        const result = updateDestinationSchema.safeParse({
            title,
            description,
            destinationLocation,
            image,
            popularPlaces
        })
        if(!result.success){
            return NextResponse.json({
                success:false,
                message:result.error.issues[0].message
            },{status:404})
        } 
        const destination = await destinationModel.findById(id)
        if(!destination){
            return NextResponse.json({
                success:false,
                message:"Destination not found"
            },{status:400})
        }
        const imgRes:CloudinaryResult = {}
        if(image){
          const { secure_url, public_id } = await uploadOnCloudinary(image,'destination')
          await deleteFromCloudinary(destination.image_public_id)
          imgRes.secure_url = secure_url
          imgRes.public_id = public_id 
        }

        destination.title = title  ?? destination.title
        destination.description =  description ?? destination.description
        destination.destinationLocation = destinationLocation ?? destination.destinationLocation
        destination.popularPlaces = popularPlaces.length ? popularPlaces : destination.popularPlaces
        destination.image = imgRes.secure_url ?? destination.image
        destination.image_public_id = imgRes.public_id ?? destination.image_public_id
        await destination.save()

        return NextResponse.json({
            success:true,
            message:"Destination updated successfully"
        },{status:200})
})
export const DELETE = withHandler(async (req:NextRequest,user) => {
        await connectDb()
        const body = await req.json()
        if(!body?.destinationId){
            return NextResponse.json({
                success:false,
                message:"DestinationId is missing"
            },{status:400})
        }
        const destination = await  destinationModel.findById(body?.destinationId)
        if(!destination){
            return NextResponse.json({
                success:false,
                message:"Destination not found"
            },{status:400})
        }
        // Don't orphan packages that belong to this destination
        const packageCount = await packageModel.countDocuments({destinationId: destination._id})
        if(packageCount > 0){
            return NextResponse.json({
                success:false,
                message:`Cannot delete: this destination has ${packageCount} package(s). Delete them first.`
            },{status:409})
        }
        await destination.deleteOne()
        await deleteFromCloudinary(destination.image_public_id)
        return NextResponse.json({
            success:true,
            message:"Destination deleted successfully"
        },{status:200})
})
