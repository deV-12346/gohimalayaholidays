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

export interface GetBookingsResponse {
  success: boolean;
  message: string;
  bookings: Booking[];
}

export interface UpdateBookingStatusRequest {
  bookingId: string;
  bookingStatus: BookingStatus;
}

export interface UpdatePaymentStatusRequest {
  bookingId: string;
  paymentStatus: PaymentStatus;
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
    getBookings: builder.query<GetBookingsResponse, void>({
      query: () => ({
        url: "/admin/booking",
        method: "GET",
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
  }),
});

export const {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
  useUpdatePaymentStatusMutation,
} = bookingApi;
