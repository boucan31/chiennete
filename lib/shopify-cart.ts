// lib/shopify-cart.ts
// Fonctions pour gérer le panier Shopify avec Storefront API

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

// Créer ou obtenir un panier
export async function createCart(): Promise<{ cartId: string; checkoutUrl: string } | null> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.warn('Shopify credentials not configured');
    return null;
  }

  try {
    const query = `
      mutation cartCreate {
        cartCreate {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors || data.data.cartCreate.userErrors.length > 0) {
      console.error('Shopify GraphQL errors:', data.errors || data.data.cartCreate.userErrors);
      return null;
    }

    return {
      cartId: data.data.cartCreate.cart.id,
      checkoutUrl: data.data.cartCreate.cart.checkoutUrl,
    };
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

// Ajouter un item au panier
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<{ success: boolean; checkoutUrl?: string; error?: string }> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return { success: false, error: 'Shopify credentials not configured' };
  }

  try {
    const query = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity,
        },
      ],
    };

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors || data.data.cartLinesAdd.userErrors.length > 0) {
      const errors = data.errors || data.data.cartLinesAdd.userErrors;
      console.error('Shopify GraphQL errors:', errors);
      return {
        success: false,
        error: errors[0]?.message || 'Erreur lors de l\'ajout au panier',
      };
    }

    return {
      success: true,
      checkoutUrl: data.data.cartLinesAdd.cart.checkoutUrl,
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

