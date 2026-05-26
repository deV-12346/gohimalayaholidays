import mongoose from "mongoose"
interface ConnectionProps {
    isConnected?:number
}
const connection:ConnectionProps = {}
export const connectDb = async() =>{
    if(connection.isConnected){
    console.log("MongoDB Already connected..")
        return 
    }
    try{
      const conn = await mongoose.connect(process.env.MONGODB_URI as string)
      console.log("connection",conn.connection.readyState)
      connection.isConnected = conn.connection.readyState
      console.log("MongoDB connected successfully")
    }catch(err){
     console.log("MongoDB failed to Connect",err)
     throw err
    }
}