import { drizzle } from "drizzle-orm/node-postgres/driver.js";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool);
