import z from "zod"
import { customerSchema } from "./customer.schema"
import { bookingSchema } from "./booking.schema"

export const customerBookingSchema =
  customerSchema.merge(
    bookingSchema
  )