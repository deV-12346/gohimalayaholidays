import {v2 as cloudinary} from "cloudinary"
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SCERET_KEY,
})
export interface CloudinaryResult{
    secure_url?:string;
    public_id?:string
}
export const uploadOnCloudinary = async(file:File,fn:string):Promise<CloudinaryResult> =>{
    const folderName = `${process.env.CLOUDINARY_FOLDERNAME}/${fn}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    return new Promise<CloudinaryResult>((resolve,reject)=>{
        const uploasStream = cloudinary.uploader.upload_stream(
            {
            folder:folderName
            },
            (error,result)=>{
                console.log(result)
                if(error) reject(error)
                else resolve({
                 secure_url:result!.secure_url,
                 public_id:result!.public_id,
                })
            }
        )
        uploasStream.end(buffer)
    })
}
export const deleteFromCloudinary = async(public_id:string)=>{
    const res= await cloudinary.uploader.destroy(public_id)
    console.log(res)
}