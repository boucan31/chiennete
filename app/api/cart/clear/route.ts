import { NextResponse } from 'next/server';
import { clearCart } from '@/lib/shopify-cart';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartId } = body;

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    const result = await clearCart(cartId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to clear cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cart: result.cart,
    });
  } catch (error) {
    console.error('Error in cart clear API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
