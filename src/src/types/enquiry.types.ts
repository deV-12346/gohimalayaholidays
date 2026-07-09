import { Enquiry } from "@/models/enquiry.model";

export interface ApiResponse {
  success: boolean;
  message:string;
  equiries?: Enquiry[]
  totalCount?: number
}
export interface EnquiryType {
    name:string;
    email:string;
    phoneNumber:string;
    message:string
}