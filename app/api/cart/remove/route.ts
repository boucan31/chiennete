import { NextResponse } from 'next/server';
import { removeCartLine } from '@/lib/shopify-cart';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartId, lineId } = body;

    if (!cartId || !lineId) {
      return NextResponse.json(
        { error: 'Cart ID and line ID are required' },
        { status: 400 }
      );
    }

    const result = await removeCartLine(cartId, lineId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to remove cart line' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cart: result.cart,
    });
  } catch (error) {
    console.error('Error in cart remove API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

