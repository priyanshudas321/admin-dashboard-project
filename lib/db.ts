import { Pool } from "pg";

let pool: Pool;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Please define the DATABASE_URL environment variable inside .env",
  );
}

const poolConfig: any = {
  connectionString: process.env.DATABASE_URL,
  max: 10, // Max number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
};

// Check for production or if using NeonDB (which requires SSL)
if (process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('neondb')) {
  // Use explicit SSL configuration to avoid 'prefer' alias warning
  poolConfig.ssl = {
    rejectUnauthorized: false, // For self-signed certs or NeonDB compatibility
    // Alternatively, use 'verify-full' if you have the CA cert
  };
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
