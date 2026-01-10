import { NextResponse } from 'next/server';
import { getCart } from '@/lib/shopify-cart';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('cartId');

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    const cart = await getCart(cartId);

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error('Error in cart get API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

