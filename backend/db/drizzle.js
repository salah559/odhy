import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({
  user: "DB_USER",
  host: "localhost",
  database: "odhiyaty",
  password: "DB_PASSWORD",
  port: 5432,
});

export const db = drizzle(pool);
