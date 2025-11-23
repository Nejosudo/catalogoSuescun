import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerContact, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        customerContact,
        status: 'REQUESTED',
        items: {
          create: items.map((item: any) => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            personalizationImage: item.personalizationImage,
            personalizationText: item.personalizationText,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
