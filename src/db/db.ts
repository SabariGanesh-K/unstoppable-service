import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// console.log(process.env.DATABASE_PWD!)
// export const connection = postgres(process.env.DATABASE_URL!);
// export const dba = postgres({
//     username: 'root',
//     password: process.env.DATABASE_PWD!,
//     host: 'localhost',
//     port: 5432,
//     database: 'booking-service-db',
//   });
// Replace with your RDS database credentials
const dbConfig = {
  username: 'postgres',
  password: process.env.PROD_DATABASE_PWD!,
  host: process.env.PROD_DATABASE_URL!,
  port: 5432,
  database: 'bookingdatabase',
};

const localDbConfig = {
  
        username: 'root',
        password: process.env.DEV_DATABASE_PWD!,
        host: 'localhost',
        port: 5432,
        database: 'booking-service-db',
      
}
// Create a PostgreSQL connection
const connection = postgres({
  ...dbConfig,
  ssl: {
    rejectUnauthorized: false, // Set to true for self-signed certificates
  },
});


  export const db = drizzle(connection)
  