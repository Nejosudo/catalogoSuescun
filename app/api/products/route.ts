import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const type = searchParams.get('type');
  const isHidden = searchParams.get('isHidden');

  const where: any = {};

  if (categoryId) {
    where.categoryId = parseInt(categoryId);
  }
  if (type) {
    where.type = type;
  }
  if (isHidden === 'false') {
    where.isHidden = false;
  }
  // If isHidden is not specified or 'true', we might show all (for admin), 
  // but usually public API should default to hidden=false. 
  // Let's assume admin passes nothing to see all, and public passes isHidden=false.
  // Actually, let's make it explicit:
  // Public view: isHidden=false
  // Admin view: (no filter on isHidden)

  try {
    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, images, categoryId, type, isPersonalizable } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images: JSON.stringify(images), // Expecting array of URLs
        categoryId: parseInt(categoryId),
        type,
        isPersonalizable: isPersonalizable || false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
