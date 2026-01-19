import client from './shopify-client';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOPIFY_ADMIN_API_KEY = process.env.SHOPIFY_ADMIN_API_KEY;
const SHOPIFY_ADMIN_API_SECRET = process.env.SHOPIFY_ADMIN_API_SECRET;
// API Version - defaults to 2024-01, can be overridden with SHOPIFY_API_VERSION
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType?: string;
  tags: string[];
  images: Array<{
    src: string;
    alt: string;
  }>;
  variants: Array<{
    id: string;
    price: string;
    formattedPrice: string;
    currencyCode: string;
    title: string;
    availableForSale: boolean;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  }>;
  onlineStoreUrl?: string;
  availableForSale?: boolean;
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
              productType
              tags
              images(first: 3) {
                edges {
                  node {
                    src
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    price {
                      amount
                      currencyCode
                    }
                    title
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              availableForSale
              onlineStoreUrl
            }
          }
        }
      }
    `;

    const variables = { first: 20 };

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

    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      return [];
    }

    return data.data.products.edges.map((edge: any) => {
      const firstVariant = edge.node.variants.edges[0]?.node;
      const priceAmount = parseFloat(firstVariant?.price.amount || '0');
      const currencyCode = firstVariant?.price.currencyCode || 'EUR';
      
      // Format price in euros
      const formattedPrice = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currencyCode,
      }).format(priceAmount);

      return {
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        description: edge.node.description,
        vendor: edge.node.vendor,
        productType: edge.node.productType || '',
        tags: edge.node.tags || [],
        images: edge.node.images.edges.map((img: any) => ({
          src: img.node.src,
          alt: img.node.altText || edge.node.title,
        })),
        variants: edge.node.variants.edges.map((variant: any) => {
          const variantPrice = parseFloat(variant.node.price.amount);
          return {
            id: variant.node.id,
            price: `${variant.node.price.amount} ${variant.node.price.currencyCode}`,
            formattedPrice: new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: variant.node.price.currencyCode,
            }).format(variantPrice),
            currencyCode: variant.node.price.currencyCode,
            title: variant.node.title,
            availableForSale: variant.node.availableForSale ?? true,
            selectedOptions: variant.node.selectedOptions?.map((opt: any) => ({
              name: opt.name,
              value: opt.value,
            })) || [],
          };
        }),
        availableForSale: edge.node.availableForSale ?? true,
        onlineStoreUrl: edge.node.onlineStoreUrl,
      };
    });
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
      `https://${SHOPIFY_ADMIN_API_KEY}:${SHOPIFY_ADMIN_API_SECRET}@${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/products.json`,
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

// Get a single product by handle
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.warn('Shopify credentials not configured');
    return null;
  }

  try {
    const query = `
      query getProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          vendor
          productType
          tags
          images(first: 10) {
            edges {
              node {
                src
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
                title
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          availableForSale
          onlineStoreUrl
        }
      }
    `;

    const variables = { handle };

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
      return null;
    }

    // Vérifier si data.data existe
    if (!data.data) {
      console.error('Shopify API response missing data:', data);
      return null;
    }

    // Vérifier si le produit existe
    if (!data.data.product) {
      console.warn(`Product with handle "${handle}" not found in Shopify`);
      return null;
    }

    const product = data.data.product;
    const firstVariant = product.variants.edges[0]?.node;
    const priceAmount = parseFloat(firstVariant?.price.amount || '0');
    const currencyCode = firstVariant?.price.currencyCode || 'EUR';

    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.descriptionHtml || product.description,
      vendor: product.vendor,
      productType: product.productType || '',
      tags: product.tags || [],
      images: product.images.edges.map((img: any) => ({
        src: img.node.src,
        alt: img.node.altText || product.title,
      })),
      variants: product.variants.edges.map((variant: any) => {
        const variantPrice = parseFloat(variant.node.price.amount);
        return {
          id: variant.node.id,
          price: `${variant.node.price.amount} ${variant.node.price.currencyCode}`,
          formattedPrice: new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: variant.node.price.currencyCode,
          }).format(variantPrice),
          currencyCode: variant.node.price.currencyCode,
          title: variant.node.title,
          availableForSale: variant.node.availableForSale ?? true,
          selectedOptions: variant.node.selectedOptions?.map((opt: any) => ({
            name: opt.name,
            value: opt.value,
          })) || [],
        };
      }),
      availableForSale: product.availableForSale ?? true,
      onlineStoreUrl: product.onlineStoreUrl,
    };
  } catch (error) {
    console.error('Error fetching product from Shopify:', error);
    return null;
  }
}

// Get the first sweatshirt from the products list
export async function getFirstSweatshirt(): Promise<ShopifyProduct | null> {
  try {
    const products = await getProducts();
    
    // Find the first product that is a sweatshirt
    // Check by productType, title, or tags
    const sweatshirt = products.find((product) => {
      const productTypeLower = (product.productType || '').toLowerCase();
      const titleLower = product.title.toLowerCase();
      const tagsLower = product.tags.join(' ').toLowerCase();
      
      return (
        productTypeLower.includes('sweatshirt') ||
        productTypeLower.includes('sweat') ||
        titleLower.includes('sweatshirt') ||
        titleLower.includes('sweat') ||
        tagsLower.includes('sweatshirt') ||
        tagsLower.includes('sweat')
      );
    });
    
    return sweatshirt || null;
  } catch (error) {
    console.error('Error fetching first sweatshirt:', error);
    return null;
  }
}


// Utility function to list all products with their handles (for debugging)
export async function listAllProductsWithHandles(): Promise<void> {
  try {
    const products = await getProducts();
    
    console.log('\n=== LISTE DE TOUS LES PRODUITS ET LEURS HANDLES ===\n');
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. "${product.title}"`);
      console.log(`   Handle: ${product.handle}`);
      console.log(`   Type: ${product.productType || 'N/A'}`);
      console.log(`   Tags: ${product.tags.join(', ') || 'Aucun'}`);
      console.log('');
    });
    
    console.log('=== FIN DE LA LISTE ===\n');
    
    // Chercher spécifiquement les sweaters
    const sweaters = products.filter((product) => {
      const titleLower = product.title.toLowerCase();
      const handleLower = product.handle.toLowerCase();
      return (
        titleLower.includes('sweater') ||
        titleLower.includes('sweat') ||
        handleLower.includes('sweater') ||
        handleLower.includes('sweat')
      );
    });
    
    if (sweaters.length > 0) {
      console.log('\n=== SWEATERS TROUVÉS ===\n');
      sweaters.forEach((product, index) => {
        console.log(`${index + 1}. "${product.title}"`);
        console.log(`   Handle: ${product.handle}`);
        console.log('');
      });
      console.log('=== FIN DES SWEATERS ===\n');
    }
  } catch (error) {
    console.error('Error listing products:', error);
  }
}

// Get sweater product by color
export async function getSweaterByColor(color: string): Promise<ShopifyProduct | null> {
  // Mapping couleur → handle du produit
  const colorToHandle: Record<string, string> = {
    'blanc': 'sweater-white-drop-2025',
    'white': 'sweater-white-drop-2025',
    'gris': 'sweater-grey-drop-2025',
    'gray': 'sweater-grey-drop-2025',
    'grey': 'sweater-grey-drop-2025',
    'noir': 'sweater-black-drop-2025',
    'black': 'sweater-black-drop-2025',
  };

  const normalizedColor = color.toLowerCase().trim();
  const handle = colorToHandle[normalizedColor];

  if (!handle) {
    console.warn(`No handle found for color: ${color}`);
    return null;
  }

  console.log(`Fetching product with handle: ${handle} for color: ${color}`);
  
  try {
    const product = await getProductByHandle(handle);
    if (!product) {
      console.warn(`Product not found for handle: ${handle}. Please verify the handle in Shopify.`);
    }
    return product;
  } catch (error) {
    console.error(`Error fetching sweater for color ${color}:`, error);
    return null;
  }
}

// Get t-shirt product by color
export async function getTShirtByColor(color: string): Promise<ShopifyProduct | null> {
  // Mapping couleur → handle du produit
  const colorToHandle: Record<string, string> = {
    'blanc': 't-shirt-white-drop-2025',
    'white': 't-shirt-white-drop-2025',
    'gris': 't-shirt-grey-drop-2025',
    'gray': 't-shirt-grey-drop-2025',
    'grey': 't-shirt-grey-drop-2025',
    'noir': 't-shirt-black-drop-2025',
    'black': 't-shirt-black-drop-2025',
  };

  const normalizedColor = color.toLowerCase().trim();
  const handle = colorToHandle[normalizedColor];

  if (!handle) {
    console.warn(`No handle found for t-shirt color: ${color}`);
    return null;
  }

  console.log(`Fetching t-shirt product with handle: ${handle} for color: ${color}`);
  
  try {
    const product = await getProductByHandle(handle);
    if (!product) {
      console.warn(`T-shirt product not found for handle: ${handle}. Please verify the handle in Shopify.`);
    }
    return product;
  } catch (error) {
    console.error(`Error fetching t-shirt for color ${color}:`, error);
    return null;
  }
}

// Get beanie product by color
export async function getBeanieByColor(color: string): Promise<ShopifyProduct | null> {
  // Mapping couleur → handle du produit
  const colorToHandle: Record<string, string> = {
    'blanc': 'white-drop-2025',
    'white': 'white-drop-2025',
    'gris': 'grey-drop-2025',
    'gray': 'grey-drop-2025',
    'grey': 'grey-drop-2025',
    'vert': 'green-drop-2025',
    'green': 'green-drop-2025',
    'noir': 'black-drop-2025',
    'black': 'black-drop-2025',
  };

  const normalizedColor = color.toLowerCase().trim();
  const handle = colorToHandle[normalizedColor];

  if (!handle) {
    console.warn(`No handle found for beanie color: ${color}`);
    return null;
  }

  console.log(`Fetching beanie product with handle: ${handle} for color: ${color}`);
  
  try {
    const product = await getProductByHandle(handle);
    if (!product) {
      console.warn(`Beanie product not found for handle: ${handle}. Please verify the handle in Shopify.`);
    }
    return product;
  } catch (error) {
    console.error(`Error fetching beanie for color ${color}:`, error);
    return null;
  }
}
