const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOPIFY_ADMIN_API_KEY = process.env.SHOPIFY_ADMIN_API_KEY;
const SHOPIFY_ADMIN_API_SECRET = process.env.SHOPIFY_ADMIN_API_SECRET;

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
  variants: Array<{
    id: string;
    price: string;
    currencyCode: string;
    title: string;
  }>;
  onlineStoreUrl?: string;
}

// Using Storefront API (recommended for public product display)
export async function getProducts(): Promise<ShopifyProduct[]> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.warn('Shopify credentials not configured. Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN');
    return [];
  }

  try {
    const query = `
      query getProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              vendor
              images(first: 1) {
                edges {
                  node {
                    src
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price {
                      amount
                      currencyCode
                    }
                    title
                  }
                }
              }
              onlineStoreUrl
            }
          }
        }
      }
    `;

    const variables = { first: 20 };

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
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

    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      return [];
    }

    return data.data.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      vendor: edge.node.vendor,
      images: edge.node.images.edges.map((img: any) => ({
        src: img.node.src,
        alt: img.node.altText || edge.node.title,
      })),
      variants: edge.node.variants.edges.map((variant: any) => ({
        id: variant.node.id,
        price: `${variant.node.price.amount} ${variant.node.price.currencyCode}`,
        currencyCode: variant.node.price.currencyCode,
        title: variant.node.title,
      })),
      onlineStoreUrl: edge.node.onlineStoreUrl,
    }));
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    return [];
  }
}

// Alternative: Using Admin API (requires admin credentials)
export async function getProductsAdmin(): Promise<ShopifyProduct[]> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_API_KEY || !SHOPIFY_ADMIN_API_SECRET) {
    console.warn('Shopify Admin credentials not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://${SHOPIFY_ADMIN_API_KEY}:${SHOPIFY_ADMIN_API_SECRET}@${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products.json`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify Admin API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.products.map((product: any) => ({
      id: product.id.toString(),
      title: product.title,
      handle: product.handle,
      description: product.body_html || '',
      vendor: product.vendor || '',
      images: product.images.map((img: any) => ({
        src: img.src,
        alt: img.alt || product.title,
      })),
      variants: product.variants.map((variant: any) => ({
        id: variant.id.toString(),
        price: variant.price,
        currencyCode: 'EUR',
        title: variant.title,
      })),
    }));
  } catch (error) {
    console.error('Error fetching products from Shopify Admin API:', error);
    return [];
  }
}

