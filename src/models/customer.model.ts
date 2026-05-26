import { Model, model, models, Schema } from "mongoose";

export interface Customer extends Document{
    _id:string;
    customerName:string;
    phoneNumber:string;
    email:string;
    dob:string;
    otp:number;
}
const customerSchema:Schema<Customer> = new Schema({
    customerName:{
        trim:true,
        requird:true,
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
    }
},{timestamps:true})
export const customerModel =  models.Customer as Model<Customer>  || model<Customer>("customer",customerSchema) 