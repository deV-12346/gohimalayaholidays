"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BookingDetailsModal from "@/components/admin/modals/BookingDetailsModal";
import DataTable, { DataTableColumn } from "@/components/admin/common/DataTable";
import { useGetBookingsQuery } from "@/services/bookings/bookingApi";
import type { Booking } from "@/models/booking.model"; // adjust import path to your actual Booking type

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    case "Pending":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    case "Cancelled":
      return "border-red-500/30 bg-red-500/10 text-red-400";
    default:
      return "border-zinc-500/30 bg-zinc-500/10 text-zinc-400";
  }
};

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // NOTE: update useGetBookingsQuery (and the bookingApi endpoint) to accept
  // { page, limit, search } and to return { bookings, totalCount } from the server.
  const { data, isLoading, isFetching } = useGetBookingsQuery({
    page,
    limit: rowsPerPage,
    search,
  });

  const columns: DataTableColumn<Booking>[] = [
    {
      header: "Customer",
      cell: (booking) => (
        <div>
          <p className="font-medium text-white">
            {booking.customerId.customerName}
          </p>
          <p className="text-sm text-zinc-500">{booking.customerId.email}</p>
        </div>
      ),
    },
    {
      header: "Package",
      cell: (booking) => (
        <span className="text-white">{booking.packageId.title}</span>
      ),
    },
    {
      header: "Destination",
      cell: (booking) => (
        <span className="text-zinc-400">{booking.destinationId.title}</span>
      ),
    },
    {
      header: "Travel Date",
      cell: (booking) => (
        <span className="text-zinc-400">
          {new Date(booking.travelDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Persons",
      cell: (booking) => (
        <span className="text-white">{booking.totalPersons}</span>
      ),
    },
    {
      header: "Amount",
      cell: (booking) => (
        <span className="font-semibold text-emerald-400">
          ₹{booking.totalPrice}
        </span>
      ),
    },
    {
      header: "Booking Status",
      cell: (booking) => (
        <Badge variant="outline" className={getStatusColor(booking.bookingStatus)}>
          {booking.bookingStatus}
        </Badge>
      ),
    },
    {
      header: "Payment",
      cell: (booking) => (
        <Badge variant="outline" className={getStatusColor(booking.paymentStatus)}>
          {booking.paymentStatus}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (booking) => <BookingDetailsModal booking={booking} />,
    },
  ];

  return (
    <DataTable<Booking>
      title="Bookings"
      description="Manage customer bookings"
      data={data?.bookings}
      isLoading={isLoading}
      isFetching={isFetching}
      columns={columns}
      keyExtractor={(booking) => booking._id}
      emptyIcon={CalendarCheck}
      emptyTitle="No bookings found"
      emptyDescription="No bookings yet"
      searchPlaceholder="Search bookings..."
      totalItems={data?.totalCount ?? 0}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={setPage}
      onRowsPerPageChange={setRowsPerPage}
      onSearchChange={setSearch}
    />
  );
}
