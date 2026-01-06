/**
 * Configuration Shopify - Template
 * 
 * Ce fichier montre la structure de configuration Shopify.
 * Pour utiliser cette configuration, créez un fichier shopify.config.js
 * et copiez le contenu en remplaçant les valeurs.
 * 
 * OU utilisez simplement les variables d'environnement dans .env.local
 */

module.exports = {
  // Configuration Storefront API (recommandé pour afficher les produits)
  storefront: {
    domain: process.env.SHOPIFY_STORE_DOMAIN || 'la-chiennete-7335.myshopify.com',
    accessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    apiVersion: process.env.SHOPIFY_API_VERSION || '2024-01',
  },

  // Configuration Admin API (optionnel, pour la gestion de la boutique)
  admin: {
    domain: process.env.SHOPIFY_STORE_DOMAIN || 'la-chiennete-7335.myshopify.com',
    apiKey: process.env.SHOPIFY_ADMIN_API_KEY,
    apiSecret: process.env.SHOPIFY_ADMIN_API_SECRET,
    apiVersion: process.env.SHOPIFY_API_VERSION || '2024-01',
  },

  // URLs de l'API
  urls: {
    storefront: (domain, version) => 
      `https://${domain}/api/${version}/graphql.json`,
    admin: (domain, version) => 
      `https://${domain}/admin/api/${version}/products.json`,
  },
};

