import { destinationSchema } from "@/schema/destination.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/option";
import { destinationModel } from "@/models/destination.model";
import { CloudinaryResult, deleteFromCloudinary, uploadOnCloudinary } from "@/libs/cloudinary";
import {  Types } from "mongoose";
import { connectDb } from "@/libs/ConnectDb";
import { withHandler } from "@/libs/withHandler";
import { withErrorHandler } from "@/libs/withErrorHandler";

export const POST = withHandler(async (req:NextRequest,user) => {
        await connectDb()
        const formData = await req.formData()
        const title = formData.get('title') as string
        const description = formData.get('description') as string
        const destinationLocation = formData.get("destinationLocation") as string
        const image = formData.get('image') as File
        const popularPlaces = JSON.parse(formData.get('popularPlaces') as string) as string[]
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
        const destinations = await destinationModel.find()
        if(!destinations){
            return NextResponse.json({
                success:false,
                message:"Destination not found"
            },{status:404})
        }
        return NextResponse.json({
            success:true,
            message:"Destination fetched successfully",
            destinations
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
        const result = destinationSchema.safeParse({
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
        await destination?.deleteOne()
        await deleteFromCloudinary(destination?.image_public_id)
        return NextResponse.json({
            success:true,
            message:"Destination deleted successfully"
        },{status:200})
})
