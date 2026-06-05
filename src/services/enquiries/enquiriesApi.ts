import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EnquiryType,ApiResponse } from "@/types/enquiry.types";

export const enquiryApi = createApi({
  reducerPath: "enquiryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Enquiries"],
  endpoints: (builder) => ({
    getEnquiries: builder.query<ApiResponse, void>({
      query: () => "admin/enquiries",
      providesTags: ["Enquiries"],
    }),
    createEnquiry:builder.mutation<ApiResponse,EnquiryType>({
      query:(data)=>({
         url:"/admin/enquiries",
         body:data,
         method:"POST"
      }),
      invalidatesTags:["Enquiries"]
    })
  }),
});

export const { useGetEnquiriesQuery , useCreateEnquiryMutation} = enquiryApi;