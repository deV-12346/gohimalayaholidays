import { CloudinaryResult } from "@/libs/cloudinary";
import { model, models, Schema,Model, Types } from "mongoose";

export interface Package extends Document{
    _id:string;
    destinationId:Types.ObjectId
    title:string;
    description:string;
    price:number;
    duration:number;
    slots:number;
    includedService:string[];
    excludedService:string[];
    packageImages:CloudinaryResult[]
}
const packageSchema:Schema<Package> = new Schema({
    destinationId:{
        type:Schema.Types.ObjectId,
        ref:"destination",
        required:true,
    },
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    packageImages:[
         {
            secure_url:{
                required:true,
                type:String
            },
            public_id:{
                type:String
            },
        }
    ],
    price:{
        type:Number,
        required:true
    },
    slots:{
        type:Number,
        required:true,
    },    
    duration:{
        type:Number,
        required:true
    },
    includedService:[
        {
            type:String,
            required:true,
        }
    ],
    excludedService:[
        {
            type:String,
            required:true,
        }
    ],
},{timestamps:true})

export const packageModel =
  (models.package as Model<Package>) ||
  model<Package>("package", packageSchema);

export default packageModel;