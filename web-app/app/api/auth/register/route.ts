import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, businessName } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if demo mode is enabled and limit reached
    if (process.env.DEMO_MODE === 'true') {
      const [countResult] = await query<any>(
        'SELECT COUNT(*) as count FROM users'
      );
      if (countResult.count >= parseInt(process.env.MAX_DEMO_USERS || '10')) {
        return NextResponse.json(
          { error: 'Demo user limit reached. Please contact admin.' },
          { status: 403 }
        );
      }
    }

    // Check if user already exists
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate UUID (MySQL 8.0+) or use crypto
    const userId = crypto.randomUUID();

    // Insert user
    await query(
      `INSERT INTO users (id, email, password_hash, full_name, business_name, role, is_active, email_verified) 
       VALUES (?, ?, ?, ?, ?, 'user', TRUE, FALSE)`,
      [userId, email, passwordHash, fullName || null, businessName || null]
    );

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: { id: userId, email, fullName },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
