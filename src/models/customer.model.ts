import { Model, model, models, Schema } from "mongoose";

export interface Customer extends Document{
    _id:string;
    customerName:string;
    phoneNumber:string;
    email:string;
    dob?:string;
    otp?:number | null;
    otpExpiry?:Date | null;
    isVerified:boolean;
}
const customerSchema:Schema<Customer> = new Schema({
    customerName:{
        trim:true,
        required:true,
        type:String
    },
    phoneNumber:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    dob:{
        required:true,
        type:String
    },
    otp:{
        type:Number
    },
    otpExpiry:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
const customerModel =
  (models.customer as Model<Customer>) ||
  model<Customer>("customer", customerSchema);

export default customerModel;