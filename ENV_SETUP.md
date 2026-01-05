# Configuration des variables d'environnement

## Variables requises pour Shopify

### Option 1 : Storefront API (Recommandé)

```env
SHOPIFY_STORE_DOMAIN=votre-boutique.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=votre_storefront_access_token
```

### Option 2 : Admin API (Alternative)

```env
SHOPIFY_STORE_DOMAIN=votre-boutique.myshopify.com
SHOPIFY_ADMIN_API_KEY=votre_admin_api_key
SHOPIFY_ADMIN_API_SECRET=votre_admin_api_secret
```

## Configuration sur Railway

1. Allez dans votre projet Railway
2. Cliquez sur **Variables**
3. Ajoutez les variables ci-dessus
4. Railway redéploiera automatiquement avec les nouvelles variables

## Configuration locale

Créez un fichier `.env.local` à la racine du projet avec les variables ci-dessus.

