import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  _id: string;
  adminName: string;
  email: string;
  phoneNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddAdminRequest {
  adminName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    addAdmin: builder.mutation<ApiResponse, AddAdminRequest>({
      query: (body) => ({
        url: "/admin/add-admin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),

    changePassword: builder.mutation<ApiResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: "/admin/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAddAdminMutation, useChangePasswordMutation } = adminApi;
