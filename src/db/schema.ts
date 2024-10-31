import { pgTable, integer, varchar, serial, decimal, timestamp, text } from 'drizzle-orm/pg-core';
import { date } from 'drizzle-orm/pg-core';

export const seatMaster = pgTable('seat_master', {
    seatId: serial('seat_id').primaryKey(),
    seatRow: integer('seat_row'),
    section: text('section'),
    seatNumber: text('seat_number'),
});

export const seatBooking = pgTable('seat_booking', {
    bookingId: serial('booking_id').primaryKey(),
    bookingDate: date('booking_date'),
    showTime: text('show_time'),
    customerName: text('customer_name'),
    bookedAtDateTime: timestamp('booked_at_datetime').defaultNow(),
    seatId: integer('seat_id').references(() => seatMaster.seatId),
    amount: decimal('amount', { precision: 18, scale: 2 }),
    currentStatus: text('current_status'),
});