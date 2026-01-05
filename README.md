# LA CHIENNETÉ — Next.js + Shopify + Railway

Site e-commerce Next.js intégré avec Shopify et déployé sur Railway.app.

## 🚀 Déploiement sur Railway

### Prérequis

1. Un compte [Railway](https://railway.app)
2. Un compte [Shopify](https://www.shopify.com) avec une boutique configurée

### Configuration Shopify

#### Option 1 : Storefront API (Recommandé)

1. Connectez-vous à votre admin Shopify
2. Allez dans **Paramètres** > **Applications et intégrations** > **Développer des applications**
3. Créez une nouvelle application
4. Activez l'API **Storefront**
5. Configurez les permissions :
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
6. Installez l'application et copiez le **Storefront Access Token**

#### Option 2 : Admin API (Alternative)

1. Suivez les mêmes étapes que ci-dessus
2. Activez l'API **Admin**
3. Configurez les permissions de lecture des produits
4. Copiez l'**API Key** et l'**API Secret**

### Déploiement sur Railway

#### Méthode 1 : Via GitHub (Recommandé)

1. **Poussez votre code sur GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connectez Railway à GitHub**
   - Allez sur [railway.app](https://railway.app)
   - Cliquez sur **New Project**
   - Sélectionnez **Deploy from GitHub repo**
   - Choisissez votre repository

3. **Configurez les variables d'environnement**
   - Dans votre projet Railway, allez dans **Variables**
   - Ajoutez les variables suivantes :
     ```
     SHOPIFY_STORE_DOMAIN=votre-boutique.myshopify.com
     SHOPIFY_STOREFRONT_ACCESS_TOKEN=votre_token_storefront
     ```
   - Ou si vous utilisez l'Admin API :
     ```
     SHOPIFY_STORE_DOMAIN=votre-boutique.myshopify.com
     SHOPIFY_ADMIN_API_KEY=votre_api_key
     SHOPIFY_ADMIN_API_SECRET=votre_api_secret
     ```

4. **Railway détectera automatiquement Next.js et déploiera**

#### Méthode 2 : Via Railway CLI

1. **Installez Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Connectez-vous**
   ```bash
   railway login
   ```

3. **Initialisez le projet**
   ```bash
   railway init
   ```

4. **Ajoutez les variables d'environnement**
   ```bash
   railway variables set SHOPIFY_STORE_DOMAIN=votre-boutique.myshopify.com
   railway variables set SHOPIFY_STOREFRONT_ACCESS_TOKEN=votre_token
   ```

5. **Déployez**
   ```bash
   railway up
   ```

### Configuration locale

1. **Clonez le repository**
   ```bash
   git clone <votre-repo>
   cd 001_chiennete
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Créez un fichier `.env.local`**
   ```bash
   cp .env.example .env.local
   ```

4. **Configurez vos variables d'environnement dans `.env.local`**
   ```env
   SHOPIFY_STORE_DOMAIN=votre-boutique.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=votre_token_storefront
   ```

5. **Lancez le serveur de développement**
   ```bash
   npm run dev
   ```

6. **Ouvrez [http://localhost:3000](http://localhost:3000)**

## 📁 Structure du projet

```
001_chiennete/
├── app/
│   ├── api/
│   │   └── products/
│   │       └── route.ts          # API route pour les produits
│   ├── page.tsx                   # Page d'accueil
│   ├── layout.tsx                 # Layout principal
│   └── globals.css                # Styles globaux
├── lib/
│   └── shopify.ts                 # Fonctions d'intégration Shopify
├── railway.json                   # Configuration Railway
├── nixpacks.toml                  # Configuration Nixpacks (build)
└── .env.example                   # Exemple de variables d'environnement
```

## 🔧 Fonctionnalités

- ✅ Intégration Shopify Storefront API
- ✅ Affichage des produits depuis Shopify
- ✅ Design responsive avec Tailwind CSS
- ✅ Support du dark mode
- ✅ Déploiement optimisé pour Railway
- ✅ API route pour récupérer les produits

## 📝 Notes importantes

- **Storefront API** : Recommandé pour les sites publics car elle ne nécessite pas d'authentification admin
- **Admin API** : Alternative si vous avez besoin d'accéder à plus de données
- Railway détecte automatiquement Next.js et configure le build
- Le port est automatiquement géré par Railway (variable `PORT`)

## 🐛 Dépannage

### Les produits ne s'affichent pas

1. Vérifiez que vos variables d'environnement sont correctement configurées
2. Vérifiez que votre token Shopify a les bonnes permissions
3. Vérifiez les logs Railway pour voir les erreurs

### Erreur de build sur Railway

1. Vérifiez que Node.js 20+ est utilisé (configuré dans `package.json`)
2. Vérifiez les logs de build dans Railway
3. Assurez-vous que toutes les dépendances sont dans `package.json`

## 📚 Ressources

- [Documentation Railway](https://docs.railway.app)
- [Documentation Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Documentation Next.js](https://nextjs.org/docs)

## 📄 Licence

© 2024 LA CHIENNETÉ. Tous droits réservés.
