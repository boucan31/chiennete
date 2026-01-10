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
      // Vérifier si l'erreur indique que l'article est épuisé
      const errorMessage = result.error || 'Failed to add to cart';
      const unavailableKeywords = [
        'unavailable',
        'not available',
        'out of stock',
        'sold out',
        'not found',
        'does not exist',
        'invalid',
        'épuisé',
        'indisponible',
        'n\'existe pas',
        'introuvable',
        'article épuisé'
      ];
      
      const isUnavailable = unavailableKeywords.some(keyword => 
        errorMessage.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return NextResponse.json(
        { 
          success: false,
          error: isUnavailable ? 'article épuisé' : errorMessage
        },
        { status: isUnavailable ? 404 : 500 }
      );
    }

    // Construire la réponse avec les données disponibles
    const responseData: any = {
      success: true,
      cartId: currentCartId,
    };

    // Ajouter le panier seulement s'il est présent
    if (result.cart) {
      responseData.cart = result.cart;
    }

    // Ajouter l'URL de checkout seulement si elle est présente
    if (result.checkoutUrl) {
      responseData.checkoutUrl = result.checkoutUrl;
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in cart add API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

