import { Enquiry } from "@/models/enquiry.model";

export interface ApiResponse {
  success: boolean;
  message:string;
  equiries?: Enquiry[]
}
export interface EnquiryType {
    name:string;
    email:string;
    phoneNumber:string;
    message:string
}