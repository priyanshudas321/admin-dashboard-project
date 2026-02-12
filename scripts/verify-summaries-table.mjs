
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function verify() {
  try {
    const client = await pool.connect();
    console.log('Connected to database...');

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'summaries';
    `);

    if (res.rows.length > 0) {
      console.log('✅ Summaries table exists!');
    } else {
      console.log('❌ Summaries table NOT found!');
    }
    client.release();
  } catch (err) {
    console.error('Error verifying table:', err);
  } finally {
    await pool.end();
  }
}

verify();
