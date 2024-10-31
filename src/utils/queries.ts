export const FetchBookingQuery = `

WITH AvailableSeats AS (
    SELECT
        '2021-04-02'::DATE AS BookingDate,
        sm.SeatId,
        sm.seat_row,
        sm.section,
        sm.seat_number,
        CASE WHEN sb.SeatId IS NULL THEN 'Available' ELSE 'Booked' END AS CurrentStatus
    FROM SeatMaster sm
    LEFT JOIN SeatBooking sb ON sm.SeatId = sb.SeatId AND sb.BookingDate = '2021-04-02' AND sb.CurrentStatus = 'Booked'
    WHERE sb.SeatId IS NULL
)
SELECT  *
FROM SeatMaster sm
JOIN (
    SELECT
        a.BookingDate,
        a.SeatId,
        COUNT(*) AS Cnt
    FROM AvailableSeats a
    JOIN AvailableSeats b ON b.BookingDate = a.BookingDate AND b.SeatId BETWEEN a.SeatId AND a.SeatId + 5 - 1
    GROUP BY a.BookingDate, a.SeatId
    HAVING COUNT(*) >= 5
) BookingData ON sm.SeatId BETWEEN BookingData.SeatId AND BookingData.SeatId + 5 - 1
WHERE BookingDate = '2021-04-02';


`