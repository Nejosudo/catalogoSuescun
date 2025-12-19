import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('GET [id] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, images, categoryId, type, isPersonalizable, isHidden, isPromotion } = body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        images: images ? JSON.stringify(images) : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        type,
        isPersonalizable,
        isPromotion,
        isHidden,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('PUT [id] Error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    // 1. Fetch product to get images
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 2. Delete the product
    await prisma.product.delete({
      where: { id: productId },
    });

    // 4. Delete images from filesystem
    if (product.images) {
      try {
        const images = JSON.parse(product.images) as string[];
        for (const imageUrl of images) {
          // Extract filename from URL (assuming /uploads/filename.ext)
          const filename = imageUrl.split('/').pop();
          if (filename) {
            const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
            await unlink(filePath).catch((e) => console.error(`Failed to delete file ${filePath}:`, e));
          }
        }
      } catch (e) {
        console.error('Error parsing images or deleting files:', e);
      }
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
