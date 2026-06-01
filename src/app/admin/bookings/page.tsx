"use client";

import { useState } from "react";
import { CalendarCheck, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import BookingDetailsModal from "@/components/admin/modals/BookingDetailsModal";
import EmptyState from "@/components/admin/common/EmptyState";
import { TableSkeleton } from "@/components/admin/common/LoadingSkeleton";
import { useGetBookingsQuery } from "@/services/bookings/bookingApi";

export default function BookingsPage() {
  const { data, isLoading } = useGetBookingsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = data?.bookings?.filter((booking) =>
    booking.customerId.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customerId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.packageId.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Bookings</h1>
          <p className="mt-2 text-zinc-500">Manage customer bookings</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        {isLoading ? (
          <TableSkeleton rows={8} />
        ) : !filteredBookings || filteredBookings.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No bookings found"
            description={searchTerm ? "Try a different search term" : "No bookings yet"}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-zinc-400">Customer</TableHead>
                  <TableHead className="text-zinc-400">Package</TableHead>
                  <TableHead className="text-zinc-400">Destination</TableHead>
                  <TableHead className="text-zinc-400">Travel Date</TableHead>
                  <TableHead className="text-zinc-400">Persons</TableHead>
                  <TableHead className="text-zinc-400">Amount</TableHead>
                  <TableHead className="text-zinc-400">Booking Status</TableHead>
                  <TableHead className="text-zinc-400">Payment</TableHead>
                  <TableHead className="text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow
                    key={booking._id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">
                          {booking.customerId.customerName}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {booking.customerId.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      {booking.packageId.title}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {booking.destinationId.title}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {new Date(booking.travelDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-white">
                      {booking.totalPersons}
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-400">
                      ₹{booking.totalPrice}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(booking.bookingStatus)}
                      >
                        {booking.bookingStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(booking.paymentStatus)}
                      >
                        {booking.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <BookingDetailsModal booking={booking} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}