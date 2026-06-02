import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PackageImage {
  secure_url: string;
  public_id: string;
}

export interface Package {
  _id: string;
  destinationId: string | { _id: string; title: string; destinationLocation: string };
  title: string;
  description: string;
  price: number;
  slots: number;
  duration: number;
  includedService: string[];
  excludedService: string[];
  packageImages: PackageImage[];
  createdAt: string;
  updatedAt: string;
}

export interface GetPackagesResponse {
  success: boolean;
  message: string;
  packages: Package[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const packageApi = createApi({
  reducerPath: "packageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Package"],
  endpoints: (builder) => ({
    getPackages: builder.query<GetPackagesResponse, void>({
      query: () => ({
        url: "/admin/package",
        method: "GET",
      }),
      providesTags: ["Package"],
    }),

    createPackage: builder.mutation<ApiResponse, FormData>({
      query: (formData) => ({
        url: "/admin/package",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Package"],
    }),

    updatePackage: builder.mutation<ApiResponse, FormData>({
      query: (formData) => ({
        url: "/admin/package",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Package"],
    }),

    deletePackage: builder.mutation<ApiResponse, { packageId: string }>({
      query: (body) => ({
        url: "/admin/package",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Package"],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;
