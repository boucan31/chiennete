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

    // Vérifier les erreurs GraphQL
    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      return null;
    }

    // Vérifier si la mutation a réussi
    if (!data.data || !data.data.cartCreate) {
      console.error('Réponse invalide de Shopify:', data);
      return null;
    }

    // Vérifier les erreurs utilisateur
    if (data.data.cartCreate.userErrors && data.data.cartCreate.userErrors.length > 0) {
      console.error('Shopify user errors:', data.data.cartCreate.userErrors);
      return null;
    }

    // Vérifier que le panier est présent
    if (!data.data.cartCreate.cart) {
      console.error('Panier non retourné par Shopify:', data.data);
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
): Promise<{ success: boolean; cart?: Cart; checkoutUrl?: string; error?: string }> {
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

    // Vérifier les erreurs GraphQL
    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      const errorMessage = data.errors[0]?.message || '';
      
      // Vérifier si l'erreur indique que l'article est épuisé ou n'existe pas
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
        'introuvable'
      ];
      
      const isUnavailable = unavailableKeywords.some(keyword => 
        errorMessage.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return {
        success: false,
        error: isUnavailable ? 'article épuisé' : errorMessage || 'Erreur lors de l\'ajout au panier',
      };
    }

    // Vérifier si la mutation a réussi
    if (!data.data || !data.data.cartLinesAdd) {
      console.error('Réponse invalide de Shopify:', data);
      return {
        success: false,
        error: 'Réponse invalide de Shopify',
      };
    }

    // Vérifier les erreurs utilisateur
    if (data.data.cartLinesAdd.userErrors && data.data.cartLinesAdd.userErrors.length > 0) {
      console.error('Shopify user errors:', data.data.cartLinesAdd.userErrors);
      const errorMessage = data.data.cartLinesAdd.userErrors[0]?.message || '';
      
      // Vérifier si l'erreur indique que l'article est épuisé ou n'existe pas
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
        'introuvable'
      ];
      
      const isUnavailable = unavailableKeywords.some(keyword => 
        errorMessage.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return {
        success: false,
        error: isUnavailable ? 'article épuisé' : errorMessage || 'Erreur lors de l\'ajout au panier',
      };
    }

    // Vérifier que le panier est présent
    if (!data.data.cartLinesAdd.cart) {
      console.error('Panier non retourné par Shopify:', data.data);
      return {
        success: false,
        error: 'Panier non retourné par Shopify',
      };
    }

    return {
      success: true,
      cart: data.data.cartLinesAdd.cart,
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

    // Vérifier les erreurs GraphQL
    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      return {
        success: false,
        error: data.errors[0]?.message || 'Erreur lors de la mise à jour du panier',
      };
    }

    // Vérifier si la mutation a réussi
    if (!data.data || !data.data.cartLinesUpdate) {
      console.error('Réponse invalide de Shopify:', data);
      return {
        success: false,
        error: 'Réponse invalide de Shopify',
      };
    }

    // Vérifier les erreurs utilisateur
    if (data.data.cartLinesUpdate.userErrors && data.data.cartLinesUpdate.userErrors.length > 0) {
      console.error('Shopify user errors:', data.data.cartLinesUpdate.userErrors);
      const errorMessage = data.data.cartLinesUpdate.userErrors[0]?.message || '';
      
      // Vérifier si l'erreur indique que l'article est épuisé ou n'existe pas
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
        'introuvable'
      ];
      
      const isUnavailable = unavailableKeywords.some(keyword => 
        errorMessage.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return {
        success: false,
        error: isUnavailable ? 'article épuisé' : errorMessage || 'Erreur lors de la mise à jour du panier',
      };
    }

    // Vérifier que le panier est présent
    if (!data.data.cartLinesUpdate.cart) {
      console.error('Panier non retourné par Shopify:', data.data);
      return {
        success: false,
        error: 'Panier non retourné par Shopify',
      };
    }

    console.log('Cart updated successfully:', {
      totalQuantity: data.data.cartLinesUpdate.cart.totalQuantity,
      linesCount: data.data.cartLinesUpdate.cart.lines?.edges?.length || 0,
      firstLine: data.data.cartLinesUpdate.cart.lines?.edges?.[0]?.node ? {
        quantity: data.data.cartLinesUpdate.cart.lines.edges[0].node.quantity,
        price: data.data.cartLinesUpdate.cart.lines.edges[0].node.merchandise?.price?.amount,
        cost: data.data.cartLinesUpdate.cart.lines.edges[0].node.cost?.totalAmount?.amount,
      } : null,
    });

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

    // Vérifier les erreurs GraphQL
    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      const errorMessage = data.errors[0]?.message || '';
      
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
        'introuvable'
      ];
      
      const isUnavailable = unavailableKeywords.some(keyword => 
        errorMessage.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return {
        success: false,
        error: isUnavailable ? 'article épuisé' : errorMessage || 'Erreur lors de la suppression du panier',
      };
    }

    // Vérifier les erreurs utilisateur
    if (data.data?.cartLinesRemove?.userErrors && data.data.cartLinesRemove.userErrors.length > 0) {
      console.error('Shopify user errors:', data.data.cartLinesRemove.userErrors);
      const errorMessage = data.data.cartLinesRemove.userErrors[0]?.message || '';
      
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
        'introuvable'
      ];
      
      const isUnavailable = unavailableKeywords.some(keyword => 
        errorMessage.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return {
        success: false,
        error: isUnavailable ? 'article épuisé' : errorMessage || 'Erreur lors de la suppression du panier',
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

