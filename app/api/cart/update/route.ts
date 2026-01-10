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
        { 
          success: false,
          error: result.error || 'Failed to update cart' 
        },
        { status: 500 }
      );
    }

    // S'assurer que le panier est présent
    if (!result.cart) {
      console.error('Cart not returned from updateCartLine:', result);
      return NextResponse.json(
        { 
          success: false,
          error: 'Cart not returned from update' 
        },
        { status: 500 }
      );
    }

    // Log pour déboguer
    console.log('Update API returning cart:', {
      totalQuantity: result.cart.totalQuantity,
      linesCount: result.cart.lines?.edges?.length || 0,
      firstLineQuantity: result.cart.lines?.edges?.[0]?.node?.quantity,
      firstLinePrice: result.cart.lines?.edges?.[0]?.node?.merchandise?.price?.amount,
      firstLineCost: result.cart.lines?.edges?.[0]?.node?.cost?.totalAmount?.amount,
    });

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

