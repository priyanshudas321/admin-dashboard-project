import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password and insert new user
    const hashedPassword = await hashPassword(password);
    
    await pool.query(
      `INSERT INTO users (email, password, name, role, status)
        VALUES ($1, $2, $3, 'user', 'pending')`,
      [email, hashedPassword, name]
    );

    return NextResponse.json(
      { message: 'User created successfully. Please wait for admin approval.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error detailed:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail
    });
    return NextResponse.json(
      { message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
