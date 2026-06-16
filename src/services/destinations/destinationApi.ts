import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Destination {
  _id: string;
  title: string;
  description: string;
  image: string;
  image_public_id: string;
  destinationLocation: string;
  popularPlaces: string[];
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetDestinationsResponse {
  success: boolean;
  message: string;
  destinations: Destination[];
}

export interface CreateDestinationResponse {
  success: boolean;
  message: string;
  newDestination: Destination;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const destinationApi = createApi({
  reducerPath: "destinationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Destination"],
  endpoints: (builder) => ({
    getDestinations: builder.query<GetDestinationsResponse, void>({
      query: () => ({
        url: "/destination",
        method: "GET",
      }),
      providesTags: ["Destination"],
    }),

    createDestination: builder.mutation<CreateDestinationResponse, FormData>({
      query: (formData) => ({
        url: "/admin/destination",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Destination"],
    }),

    updateDestination: builder.mutation<ApiResponse, FormData>({
      query: (formData) => ({
        url: "/admin/destination",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Destination"],
    }),

    deleteDestination: builder.mutation<ApiResponse, { destinationId: string }>({
      query: (body) => ({
        url: "/admin/destination",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Destination"],
    }),
  }),
});

export const {
  useGetDestinationsQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} = destinationApi;
