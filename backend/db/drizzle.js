import { drizzle } from "drizzle-orm/node-postgres/driver.js";
import pg from "pg";

const connectionString = process.env.DATABASE_URL || 'postgresql://ctdccyqq_salah:silo%40salah55@localhost:5432/ctdccyqq_sheep_marketplace';

const pool = new pg.Pool({
  connectionString: connectionString,
  ssl: false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});

export const db = drizzle(pool);
export { pool };
