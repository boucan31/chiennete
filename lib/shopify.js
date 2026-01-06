// lib/shopify.js
// Configuration Shopify Storefront API Client (JavaScript version)

import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-01';

// Vérification des variables d'environnement requises
if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  console.warn(
    '⚠️ Shopify credentials not configured. Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in your .env.local file'
  );
}

// Création du client Storefront API
const client = createStorefrontApiClient({
  storeDomain: SHOPIFY_STORE_DOMAIN || '',
  apiVersion: SHOPIFY_API_VERSION,
  publicAccessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
});

export default client;

// Export des fonctions utilitaires si nécessaire
export { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN, SHOPIFY_API_VERSION };

