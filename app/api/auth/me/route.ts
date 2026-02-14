import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import pool from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Fetch user details from DB to get the name
    // Map is_approved to status for frontend compatibility
    const result = await pool.query(`
      SELECT 
        id, 
        email, 
        name, 
        role, 
        CASE 
          WHEN is_approved = true THEN 'approved' 
          ELSE 'pending' 
        END as status
      FROM users 
      WHERE id = $1
    `, [payload.id]);
    
    if (result.rows.length === 0) {
       return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    return NextResponse.json(
      { 
        user: {
          id: user.id,
          email: user.email,
          name: user.name || 'User', // Fallback
          role: user.role,
          status: user.status
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
