import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type BookingStatus = "Pending" | "Completed" | "Cancelled";
export type PaymentStatus = "Pending" | "Completed";

export interface PopulatedCustomer {
  customerName: string;
  email: string;
  phoneNumber: string;
}
export interface PopulatedDestination {
  title: string;
  destinationLocation: string;
}
export interface PopulatedPackage {
  title: string;
  price: number;
}
export interface Booking {
  _id: string;
  customerId: PopulatedCustomer;
  destinationId: PopulatedDestination;
  packageId: PopulatedPackage;
  totalPersons: number;
  travelDate: string;
  totalPrice: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GetBookingsRequest {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetBookingsResponse {
  success: boolean;
  message: string;
  bookings: Booking[];
  totalCount: number;
}

export interface UpdateBookingStatusRequest {
  bookingId: string;
  bookingStatus: BookingStatus;
}
export interface UpdatePaymentStatusRequest {
  bookingId: string;
  paymentStatus: PaymentStatus;
}
export interface SendOtpRequest {
  customerName: string;
  phoneNumber: string;
  email: string;
  dob: string;
}
export interface VerifyOtpRequest {
  email: string;
  otp: string;
  packageId: string;
  destinationId: string;
  totalPersons: number;
  travelDate: string;
  totalPrice: number;
}
export interface ApiResponse {
  success: boolean;
  message: string;
}

// ─── API Slice ────────────────────────────────────────────────────────────────
export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    // Admin Queries & Mutations
    getBookings: builder.query<GetBookingsResponse, GetBookingsRequest>({
      query: (params) => ({
        url: "/admin/booking",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          search: params.search ?? "",
        },
      }),
      providesTags: ["Booking"],
    }),
    updateBookingStatus: builder.mutation<ApiResponse, UpdateBookingStatusRequest>({
      query: (body) => ({
        url: "/admin/booking/update-booking",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),
    updatePaymentStatus: builder.mutation<ApiResponse, UpdatePaymentStatusRequest>({
      query: (body) => ({
        url: "/admin/booking/update-payment",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),
    // Customer / Public Frontend Mutations
    sendOtp: builder.mutation<ApiResponse, SendOtpRequest>({
      query: (body) => ({
        url: "/customer/send-otp",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation<ApiResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/customer/verify-account",
        method: "POST",
        body,
      }),
      // Automatically updates the Admin booking list after a new booking is confirmed
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
  useUpdatePaymentStatusMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} = bookingApi;
