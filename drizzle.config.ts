import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  migrations: {
    table: 'journal', 
    schema: 'drizzle', 
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
