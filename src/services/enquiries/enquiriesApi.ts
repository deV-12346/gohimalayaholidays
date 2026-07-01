import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EnquiryType, ApiResponse } from "@/types/enquiry.types";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface GetEnquiriesRequest {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetEnquiriesResponse extends ApiResponse {
  equiries: EnquiryType[];
  totalCount: number;
}

// ─── API Slice ────────────────────────────────────────────────────────────────
export const enquiryApi = createApi({
  reducerPath: "enquiryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Enquiries"],
  endpoints: (builder) => ({
    getEnquiries: builder.query<GetEnquiriesResponse, GetEnquiriesRequest | void>({
      query: (params) => ({
        url: "/admin/enquiries",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          search: params?.search ?? "",
        },
      }),
      providesTags: ["Enquiries"],
    }),
    createEnquiry: builder.mutation<ApiResponse, EnquiryType>({
      query: (data) => ({
        url: "/admin/enquiries",
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["Enquiries"],
    }),
  }),
});

export const { useGetEnquiriesQuery, useCreateEnquiryMutation } = enquiryApi;
