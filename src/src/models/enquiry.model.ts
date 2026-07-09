import { model, Model, models, Schema } from "mongoose";

export interface Enquiry extends Document{
    _id:string;
    name:string;
    email:string;
    phoneNumber:string;
    message:string;
    createdAt: Date;
    updatedAt: Date;
}
const enquirySchema:Schema<Enquiry> = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
},{timestamps:true})
const enquiryModel = models.Enquiry as Model<Enquiry> || model<Enquiry>('Enquiry',enquirySchema)
export default enquiryModel