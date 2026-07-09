import mongoose, { Model, models, Schema, model } from "mongoose";
export interface Admin extends Document {
    id:string,
    adminName:string,
    email:string;
    phoneNumber:Number,
    password:string,
    refreshToken?:string
}
const adminSchema:Schema<Admin> = new Schema({
    adminName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    phoneNumber:{
        type:Number,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
        required:false
    }
},{timestamps:true})
const adminModel = models.Admin as mongoose.Model<Admin> || model<Admin>('Admin',adminSchema)
export default adminModel