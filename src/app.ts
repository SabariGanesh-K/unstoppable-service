// import bookingController from "./api/controllers/bookingController";
// import { bookingRouter } from "./api/routes/bookingRoute";

const express = require('express')
const app = express()
import dotenv from "dotenv";
dotenv.config();

app.use(function(req:any,res:any,next:any){
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000/");
  
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
  
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
})
app.get("/ping", (req:any  , res:any) => {
    res.status(201).send("server works hehe");
  });

//   app.post("/booking",bookingRouter)
// app.use("/booking",bookingRouter)
app.use(require('./api/controllers/bookingController'))

  app.get("*", (req:any  , res:any) => {
    res.status(404).send("Error 404");
  });
  const PORT  = 8080;
  // const host='0.0.0.0'
  app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))

