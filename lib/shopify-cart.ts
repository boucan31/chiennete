// lib/shopify-cart.ts
// Fonctions pour gérer le panier Shopify avec Storefront API

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

// Types TypeScript pour le panier
export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    product: {
      title: string;
      handle: string;
      images: {
        edges: Array<{
          node: {
            url: string;
            altText: string | null;
          };
        }>;
      };
    };
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
    price: {
      amount: string;
      currencyCode: string;
    };
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{
      node: CartLine;
    }>;
  };
}

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

// Récupérer le panier avec tous les détails
export async function getCart(cartId: string): Promise<Cart | null> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.warn('Shopify credentials not configured');
    return null;
  }

  try {
    const query = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 250) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    product {
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                    selectedOptions {
                      name
                      value
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
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
        body: JSON.stringify({
          query,
          variables: { cartId },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      return null;
    }

    if (!data.data.cart) {
      return null;
    }

    return data.data.cart;
  } catch (error) {
    console.error('Error getting cart:', error);
    return null;
  }
}

// Mettre à jour la quantité d'un article dans le panier
export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return { success: false, error: 'Shopify credentials not configured' };
  }

  if (quantity <= 0) {
    // Si quantité <= 0, utiliser removeCartLine à la place
    return removeCartLine(cartId, lineId);
  }

  try {
    const query = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 250) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      product {
                        title
                        handle
                        images(first: 1) {
                          edges {
                            node {
                              url
                              altText
                            }
                          }
                        }
                      }
                      selectedOptions {
                        name
                        value
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                  cost {
                    totalAmount {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
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
          id: lineId,
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

    if (data.errors || data.data.cartLinesUpdate.userErrors.length > 0) {
      const errors = data.errors || data.data.cartLinesUpdate.userErrors;
      console.error('Shopify GraphQL errors:', errors);
      return {
        success: false,
        error: errors[0]?.message || 'Erreur lors de la mise à jour du panier',
      };
    }

    return {
      success: true,
      cart: data.data.cartLinesUpdate.cart,
    };
  } catch (error) {
    console.error('Error updating cart line:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

// Supprimer un article du panier
export async function removeCartLine(
  cartId: string,
  lineId: string
): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return { success: false, error: 'Shopify credentials not configured' };
  }

  try {
    const query = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 250) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      product {
                        title
                        handle
                        images(first: 1) {
                          edges {
                            node {
                              url
                              altText
                            }
                          }
                        }
                      }
                      selectedOptions {
                        name
                        value
                      }
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                  cost {
                    totalAmount {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
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
      lineIds: [lineId],
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

    if (data.errors || data.data.cartLinesRemove.userErrors.length > 0) {
      const errors = data.errors || data.data.cartLinesRemove.userErrors;
      console.error('Shopify GraphQL errors:', errors);
      return {
        success: false,
        error: errors[0]?.message || 'Erreur lors de la suppression du panier',
      };
    }

    return {
      success: true,
      cart: data.data.cartLinesRemove.cart,
    };
  } catch (error) {
    console.error('Error removing cart line:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

