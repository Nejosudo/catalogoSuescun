import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

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

    // 3. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Supabase auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 4. Create user in Prisma (local DB)
    const user = await prisma.user.create({
      data: {
        email,
        password, // Ideally we shouldn't store password here if using Supabase Auth, but current logic relies on it.
        role: 'USER', 
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
