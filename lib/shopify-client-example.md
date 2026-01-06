# Utilisation du client Shopify Storefront API

## 📁 Fichiers créés

### 1. `lib/shopify.js` (JavaScript)
Version JavaScript du client Shopify.

### 2. `lib/shopify-client.ts` (TypeScript)
Version TypeScript du client Shopify.

## 🚀 Utilisation

### Import du client

```javascript
// Dans vos composants ou pages
import client from '@/lib/shopify-client';
// ou
import client from '@/lib/shopify';
```

### Exemple d'utilisation avec le client

```javascript
import client from '@/lib/shopify-client';

// Exécuter une requête GraphQL
async function getProducts() {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
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
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await client.request(query, {
    variables: { first: 20 }
  });

  return response.data.products.edges.map(edge => edge.node);
}
```

## ⚙️ Configuration requise

Assurez-vous d'avoir ces variables dans votre `.env.local` :

```env
SHOPIFY_STORE_DOMAIN=la-chiennete-7335.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=votre_token_ici
SHOPIFY_API_VERSION=2024-01
```

## 📝 Différences avec Vite

| Vite | Next.js |
|------|---------|
| `import.meta.env.VITE_*` | `process.env.*` |
| `VITE_SHOPIFY_STORE_DOMAIN` | `SHOPIFY_STORE_DOMAIN` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | `SHOPIFY_STOREFRONT_ACCESS_TOKEN` |
| `VITE_SHOPIFY_API_VERSION` | `SHOPIFY_API_VERSION` |

## ✅ Avantages du client officiel

- ✅ Gestion automatique des erreurs
- ✅ TypeScript support
- ✅ Requêtes optimisées
- ✅ Cache intégré
- ✅ Documentation officielle Shopify

