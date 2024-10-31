
CREATE TABLE SeatMaster (
    SeatId SERIAL PRIMARY KEY,
    seat_row SMALLINT,
    section CHAR(1),
    seat_number VARCHAR(5)
);
INSERT INTO SeatMaster (seat_row, section, seat_number)
SELECT
    sr.seat_row,
    s.section,
    s.section || '-' || CAST(ROW_NUMBER() OVER (ORDER BY sr.seat_row, s.section, sn.seat_number) AS TEXT) AS seat_number
FROM
    (VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10), (11)) AS sr(seat_row)
CROSS JOIN
    (SELECT 'A' AS section, 4 AS num_seats UNION ALL SELECT 'B', 3) s
CROSS JOIN
    generate_series(1, s.num_seats) sn(seat_number)
ORDER BY
    sr.seat_row, s.section, sn.seat_number;

INSERT INTO SeatMaster (seat_row, section, seat_number)
VALUES
    (12, 'A', 'A78'),
    (12, 'A', 'A79'),
    (12, 'A', 'A80');
    --This is the booking table
CREATE TABLE SeatBooking (
    BookingId SERIAL PRIMARY KEY,
    BookingDate DATE NOT NULL,
    ShowTime VARCHAR(25) NOT NULL,
    CustomerName VARCHAR(256) NOT NULL,
    BookedAtDateTime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    SeatId INT REFERENCES SeatMaster(SeatId),
    Amount DECIMAL(18,2),
    CurrentStatus VARCHAR(25)
);

INSERT INTO SeatBooking (
    BookingDate, ShowTime, CustomerName, BookedAtDateTime, SeatId, Amount, CurrentStatus
)
SELECT
    '2021-04-02'::DATE AS BookingDate,
    'Evening 6-9' AS ShowTime,
    CONCAT('Customer - ', RIGHT('00' || FLOOR(RANDOM() * 60)::TEXT, 2)) AS CustomerName,
    NOW() AS BookedAtDateTime,
    SeatId AS SeatId,
    250,
    'Booked' AS CurrentStatus
FROM SeatMaster
WHERE SeatMaster.seat_number NOT IN (
    'B-6', 'B-7', 'A-8', 'A-9', 'A-10',
    'B-26', 'B-27', 'B-28', 'A-29', 'A-30',
    'A-31', 'A-39', 'B-40', 'A-36', 'A-37',
    'A-44', 'A-45', 'A-46', 'B-47', 'B-48'
);

 SELECT * FROM SeatMaster;
SELECT * FROM SeatBooking ORDER BY SeatId;


