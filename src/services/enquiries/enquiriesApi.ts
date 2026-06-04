import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Enquiry } from "@/models/enquiry.model";

export const enquiryApi = createApi({
  reducerPath: "enquiryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getEnquiries: builder.query<{ success: boolean; equiries: Enquiry[] }, void>({
      query: () => "admin/enquiries",
    }),
  }),
});

export const { useGetEnquiriesQuery } = enquiryApi;