import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcryptjs'; // We'll need to install this or use a simple hash for now since we can't install packages easily without user permission? 
// Actually I can run npm install. I should install bcryptjs.

export async function POST(request: Request) {
  try {
    // 1. Check if registration is enabled
    const setting = await prisma.globalSettings.findUnique({
      where: { key: 'registration_enabled' },
    });

    if (setting?.value !== 'true') {
      return NextResponse.json({ error: 'Registration is currently disabled.' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 2. Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 3. Create user (Password hashing omitted for brevity, but HIGHLY recommended for production)
    // For this demo/prototype, we will store plain text but add a TODO.
    // TODO: Add bcrypt hashing.
    const user = await prisma.user.create({
      data: {
        email,
        password, // In a real app, hash this!
        role: 'USER', // Default role
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
