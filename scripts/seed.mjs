import pg from 'pg';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env' });

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not defined in .env');
    console.error('Please configure your .env file with your Neon DB connection string.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Running schema.sql...');
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('Schema created successfully.');

    // Check if admin exists
    const adminEmail = 'test@test.com';
    const checkRes = await client.query('SELECT * FROM users WHERE email = $1', [adminEmail]);

    if (checkRes.rows.length === 0) {
      console.log('Creating Admin user...');
      const hashedPassword = await bcrypt.hash('Test123@123', 10);
      
      await client.query(
        `INSERT INTO users (email, password, name, role, status)
         VALUES ($1, $2, 'Admin User', 'admin', 'approved')`,
        [adminEmail, hashedPassword]
      );
      console.log(`Admin created: ${adminEmail} / Test123@123`);
    } else {
      console.log('Admin user already exists.');
    }

    client.release();
  } catch (err) {
    console.error('Error seeding database:', JSON.stringify(err, null, 2));
    console.error(err);
  } finally {
    await pool.end();
  }
}

seed();
