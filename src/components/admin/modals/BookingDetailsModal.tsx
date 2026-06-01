"use client";

import { useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Booking,
  BookingStatus,
  PaymentStatus,
  useUpdateBookingStatusMutation,
  useUpdatePaymentStatusMutation,
} from "@/services/bookings/bookingApi";

interface BookingDetailsModalProps {
  booking: Booking;
}

export default function BookingDetailsModal({ booking }: BookingDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>(booking.bookingStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(booking.paymentStatus);

  const [updateBookingStatus, { isLoading: isUpdatingBooking }] =
    useUpdateBookingStatusMutation();
  const [updatePaymentStatus, { isLoading: isUpdatingPayment }] =
    useUpdatePaymentStatusMutation();

  const handleUpdateBookingStatus = async () => {
    try {
      const result = await updateBookingStatus({
        bookingId: booking._id,
        bookingStatus,
      }).unwrap();
      toast.success(result.message || "Booking status updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update booking status");
    }
  };

  const handleUpdatePaymentStatus = async () => {
    try {
      const result = await updatePaymentStatus({
        bookingId: booking._id,
        paymentStatus,
      }).unwrap();
      toast.success(result.message || "Payment status updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update payment status");
    }
  };

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0b1120] text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-cyan-400">Customer Information</h3>
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Name:</span>
                <span className="font-medium">{booking.customerId.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Email:</span>
                <span className="font-medium">{booking.customerId.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Phone:</span>
                <span className="font-medium">{booking.customerId.phoneNumber}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Booking Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-cyan-400">Booking Information</h3>
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Package:</span>
                <span className="font-medium">{booking.packageId.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Destination:</span>
                <span className="font-medium">{booking.destinationId.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Location:</span>
                <span className="font-medium">{booking.destinationId.destinationLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Travel Date:</span>
                <span className="font-medium">
                  {new Date(booking.travelDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Persons:</span>
                <span className="font-medium">{booking.totalPersons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Price:</span>
                <span className="font-semibold text-emerald-400">₹{booking.totalPrice}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Status Updates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-400">Update Status</h3>
            
            <div className="space-y-2">
              <Label className="text-zinc-300">Booking Status</Label>
              <div className="flex gap-2">
                <Select value={bookingStatus} onValueChange={(val) => setBookingStatus(val as BookingStatus)}>
                  <SelectTrigger className="flex-1 border-white/10 bg-white/5 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#0b1120] text-white">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleUpdateBookingStatus}
                  disabled={isUpdatingBooking || bookingStatus === booking.bookingStatus}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600"
                >
                  {isUpdatingBooking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Payment Status</Label>
              <div className="flex gap-2">
                <Select value={paymentStatus} onValueChange={(val) => setPaymentStatus(val as PaymentStatus)}>
                  <SelectTrigger className="flex-1 border-white/10 bg-white/5 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#0b1120] text-white">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleUpdatePaymentStatus}
                  disabled={isUpdatingPayment || paymentStatus === booking.paymentStatus}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600"
                >
                  {isUpdatingPayment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
