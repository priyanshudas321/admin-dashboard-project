import { Pool } from "pg";

let pool: Pool;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env",
  );
}

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10, // Limit pool size to default Neon limit for free tier
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

if (process.env.NODE_ENV === 'production') {
  pool = new Pool(poolConfig);
} else {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any).pgPool) {
    (global as any).pgPool = new Pool(poolConfig);
  }
  pool = (global as any).pgPool;
}

export default pool;
