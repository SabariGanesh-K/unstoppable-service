const { db } = require('../../db/db');


const router = require("express").Router();

router.post("/booking/:n",async(req:any,res:any)=>{
    try{
        console.log(req.params.n);
       const result = await  db.execute(`
   
WITH 
AvailableSeats AS (
  SELECT 
    '2021-04-02'::DATE AS BookingDate, 
    sm.SeatId, 
    sm.seat_row, 
    sm.section, 
    sm.seat_number, 
    CASE 
      WHEN sb.SeatId IS NULL THEN 'Available' 
      ELSE 'Booked' 
    END AS CurrentStatus
  FROM SeatMaster sm 
  LEFT JOIN SeatBooking sb 
    ON sm.SeatId = sb.SeatId 
    AND sb.BookingDate = '2021-04-02' 
    AND sb.CurrentStatus = 'Booked'
  WHERE sb.SeatId IS NULL
),
ConsecutiveSeats AS (
  SELECT 
    sm.SeatId, 
    sm.seat_row, 
    sm.section, 
    sm.seat_number, 
    BookingData.BookingDate
  FROM SeatMaster sm 
  JOIN (
    SELECT 
      a.BookingDate, 
      a.SeatId, 
      COUNT(*) AS Cnt 
    FROM AvailableSeats a 
    JOIN AvailableSeats b 
      ON b.BookingDate = a.BookingDate 
      AND b.SeatId BETWEEN a.SeatId AND a.SeatId + ${req.params.n} - 1 
    GROUP BY 
      a.BookingDate, 
      a.SeatId 
    HAVING 
      COUNT(*) >= ${req.params.n}
  ) BookingData 
    ON sm.SeatId BETWEEN BookingData.SeatId AND BookingData.SeatId + ${req.params.n} - 1 
  WHERE 
    BookingDate = '2021-04-02'
),
FirstNAvailableSeats AS (
  SELECT 
    SeatId, 
    seat_row, 
    section, 
    seat_number, 
    BookingDate
  FROM (
    SELECT 
      SeatId, 
      seat_row, 
      section, 
      seat_number, 
      BookingDate,
      ROW_NUMBER() OVER (ORDER BY SeatId) AS row_num
    FROM AvailableSeats
  ) AS subquery
  WHERE row_num <= ${req.params.n}
)
SELECT * 
FROM ConsecutiveSeats 
UNION ALL 
SELECT * 
FROM FirstNAvailableSeats 
WHERE NOT EXISTS (
  SELECT 1 
  FROM ConsecutiveSeats
);


        
`)

// console.log(result)
// console.log(sample.filter)
        const resu = result.map((item:any)=> item.seat_number);
        console.log(resu.slice(0,2),["a","b","c"].slice(0,2),"sliced")
res.status(200).send(resu.slice(0,req.params.n));

    // )
    }
    catch(e){
        console.log("Err",e);
    res.status(401).send("Error ");

    }
})


router.get("/booked",async(req:any,res:any)=>{
    try{
        // console.log(req.params.n);
       const result = await  db.execute(`

   select seat_number from seatmaster where seatid in (select distinct seatid from seatbooking);
`)
// console.log(sample.filter)
// console.log(result)
        const resu = result.map((item:any)=> item.seat_number);
res.status(200).send(resu);

    // )
    }
    catch(e){
        console.log("Err",e);
    res.status(401).send("Error ");

    }
})


router.post("/migratedown",async(req:any,res:any)=>{
    try{
        console.log(req.params.n);
       await  db.execute(`
        DROP TABLE  SeatBooking;

        DROP TABLE  SeatMaster;
        
`)

res.status(200).send(true);

    // )
    }
    catch(e){
        console.log("Err",e);
    res.status(401).send("Error ");

    }
})

router.post("/migrateup",async(req:any,res:any)=>{
    try{
        console.log(req.params.n);
       await  db.execute(`
       
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



        
`)

res.status(200).send(true);

    // )
    }
    catch(e){
        console.log("Err",e);
    res.status(401).send("Error ");

    }
})
module.exports=router