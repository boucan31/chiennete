import { NextResponse } from 'next/server';
import { updateCartLine } from '@/lib/shopify-cart';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartId, lineId, quantity } = body;

    if (!cartId || !lineId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Cart ID, line ID, and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity cannot be negative' },
        { status: 400 }
      );
    }

    const result = await updateCartLine(cartId, lineId, quantity);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cart: result.cart,
    });
  } catch (error) {
    console.error('Error in cart update API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

