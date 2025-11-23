import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 2. Verify password (TODO: Use bcrypt in production)
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Set Auth Cookie
    const cookieStore = await cookies();
    
    if (user && typeof user === 'object' && 'id' in user) {
        cookieStore.set('auth_token', JSON.stringify({ userId: user.id, role: user.role }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        });

        return NextResponse.json({ message: 'Login successful', user: { email: user.email, role: user.role } });
    } else {
        throw new Error('User data is invalid');
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
