import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  try {
    if (key) {
      const setting = await prisma.globalSettings.findUnique({
        where: { key },
      });
      return NextResponse.json(setting || { key, value: 'false' }); // Default to false if not set
    }

    const settings = await prisma.globalSettings.findMany();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    const setting = await prisma.globalSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
