import { Model, models, Schema,model, ObjectId, Types } from "mongoose";

export interface Destination extends Document {
    _id:string;
    title:string;
    description:string;
    image:string;
    image_public_id:string,
    destinationLocation:string;
    popularPlaces:string[],
    uploadedBy:Types.ObjectId
}
const destinationSchema:Schema<Destination> = new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    image:{
        type:String,
        required:true,
        trim:true,
    },
    image_public_id:{
        type:String,
        required:true,
        trim:true
    },
    destinationLocation:{
        type:String,
        required:true,
        trim:true,
    },
    popularPlaces:[
        { 
        type:String,
        required:true
        }
    ],
    uploadedBy:{
        type:Schema.Types.ObjectId,
        ref:"Admin",
        required:true
    }
},{timestamps:true})
export const destinationModel =
  models.Destination as Model<Destination> ||
  model<Destination>("Destination", destinationSchema)
