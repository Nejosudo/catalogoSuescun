import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { type, isHidden } = body;

    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }

    const result = await prisma.product.updateMany({
      where: {
        type: type,
      },
      data: {
        isHidden: isHidden,
      },
    });

    return NextResponse.json({ 
      message: 'Bulk update successful', 
      count: result.count 
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json({ error: 'Failed to update products' }, { status: 500 });
  }
}
