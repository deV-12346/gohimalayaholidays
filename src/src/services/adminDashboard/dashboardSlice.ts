import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
interface DashboardResponse {
  success: boolean
  data: {
    totalBookings: number
    pendingBookings: number
    completedBookings: number
    cancelledBookings: number
    totalRevenue: number
  }
}
export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getDashboardStats:
      builder.query<DashboardResponse,void>({
        query: () => ({
          url:
           "/admin/dashboard",
          method: "GET",
        }),
      }),
  }),
})

export const {useGetDashboardStatsQuery} = dashboardApi