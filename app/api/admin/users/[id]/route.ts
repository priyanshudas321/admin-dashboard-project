import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status, role } = await req.json();

    // Protection for Main Admin
    // We need to fetch the user being updated first to check their email
    const targetUserRes = await pool.query('SELECT email FROM users WHERE id = $1', [id]);
    if (targetUserRes.rows.length > 0) {
        const targetEmail = targetUserRes.rows[0].email;
        if (targetEmail === 'test@test.com' && role) {
            return NextResponse.json({ message: 'Cannot modify Main Admin role' }, { status: 403 });
        }
    }

    if (status && !['pending', 'approved'].includes(status)) {
       return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    if (role && !['admin', 'user'].includes(role)) {
        return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Build dynamic query
    let query = 'UPDATE users SET ';
    const values = [];
    let paramIndex = 1;

    if (status) {
        query += `status = $${paramIndex}, `;
        values.push(status);
        paramIndex++;
    }
    if (role) {
        query += `role = $${paramIndex}, `;
        values.push(role);
        paramIndex++;
    }

    // Remove trailing comma and space
    query = query.slice(0, -2); 
    
    query += ` WHERE id = $${paramIndex} RETURNING id, email, status, role`;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
