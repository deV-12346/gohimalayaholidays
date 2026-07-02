import { model, Model, models, Schema, Types } from "mongoose";

interface Booking extends Document{
    _id:string;
    packageId:Types.ObjectId;
    destinationId:Types.ObjectId;
    customerId:Types.ObjectId;
    totalPersons:number;
    travelDate:Date;
    totalPrice:number;
    bookingStatus:"Pending" | 'Completed' | 'Cancelled',
    paymentStatus:"Pending" | "Completed" 
}
const bookingSchema:Schema<Booking> = new Schema({
    packageId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Package"
    },
    destinationId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Destination"
    },
    customerId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Customer"
    },
    travelDate:{
        type:Date,
        required:true, 
    },
    totalPersons:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    bookingStatus:{
        type: String,
        enum: [
          "Pending",
          "Completed",
          'Cancelled'
        ],

        default:"Pending",
    },
    paymentStatus:{
        type: String,
        enum: [
          "Pending",
          "Completed",
        ],

        default:'Pending'
    }
},{timestamps:true})
const bookingModel =
  (models.Booking as Model<Booking>) ||
  model<Booking>("Booking", bookingSchema);

export default bookingModel;