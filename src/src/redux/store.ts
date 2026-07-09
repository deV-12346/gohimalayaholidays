import { configureStore } from "@reduxjs/toolkit";
import { dashboardApi } from "../services/adminDashboard/dashboardSlice";
import { destinationApi } from "../services/destinations/destinationApi";
import { packageApi } from "../services/packages/packageApi";
import { bookingApi } from "../services/bookings/bookingApi";
import { adminApi } from "../services/admin/adminApi";
import { enquiryApi } from "@/services/enquiries/enquiriesApi";

export const store = configureStore({
  reducer: {
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [destinationApi.reducerPath]: destinationApi.reducer,
    [packageApi.reducerPath]: packageApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [enquiryApi.reducerPath]: enquiryApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      dashboardApi.middleware,
      destinationApi.middleware,
      packageApi.middleware,
      bookingApi.middleware,
      adminApi.middleware,
      enquiryApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
