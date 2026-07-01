import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PackageImage {
  secure_url: string;
  public_id: string;
}
export interface Package {
  _id: string;
  destinationId: string;
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

export interface GetPackagesRequest {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetPackagesResponse {
  success: boolean;
  message: string;
  packages: Package[];
  totalCount: number;
}

export interface GetPackagesByIdResponse {
  success: boolean;
  message: string;
  packages: Package;
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
    getPackages: builder.query<GetPackagesResponse, GetPackagesRequest | void>({
      query: (params) => ({
        url: "/admin/package",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          search: params?.search ?? "",
        },
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
    getPackageById: builder.query<GetPackagesByIdResponse, { packageId: string }>({
      query: ({ packageId }) => ({
        url: `/package/${packageId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useGetPackageByIdQuery,
} = packageApi;
