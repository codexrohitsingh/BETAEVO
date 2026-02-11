import { NextResponse } from 'next/server';
import { addToCartImpl } from '@/lib/product-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Please sign in' }, { status: 200 });
    }
    const { productId } = await request.json();
    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid productId' }, { status: 200 });
    }
    const result = await addToCartImpl(productId);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Failed to add to cart' }, { status: 200 });
  }
}
