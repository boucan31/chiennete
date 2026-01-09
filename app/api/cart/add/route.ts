import { NextResponse } from 'next/server';
import { createCart, addToCart } from '@/lib/shopify-cart';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variantId, quantity = 1, cartId } = body;

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    // Si pas de cartId, créer un nouveau panier
    let currentCartId = cartId;
    if (!currentCartId) {
      const cart = await createCart();
      if (!cart) {
        return NextResponse.json(
          { error: 'Failed to create cart' },
          { status: 500 }
        );
      }
      currentCartId = cart.cartId;
    }

    // Ajouter l'item au panier
    const result = await addToCart(currentCartId, variantId, quantity);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to add to cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cartId: currentCartId,
      checkoutUrl: result.checkoutUrl,
    });
  } catch (error) {
    console.error('Error in cart add API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

