# Guide d'intégration Shopify - Solution 2

Ce guide explique comment configurer votre app React pour qu'elle s'affiche avec votre design sur toutes les pages Shopify (accueil, produits, articles).

## 📋 Ce qui a été créé

### 1. Pages React
- `app/product/[handle]/page.tsx` - Page produit avec votre design
- `app/article/[handle]/page.tsx` - Page article (template de base)

### 2. Fonctions Shopify
- `getProductByHandle(handle)` dans `lib/shopify.ts` - Récupère un produit par son handle

### 3. Composant Router
- `app/components/ShopifyRouter.tsx` - Détecte les paramètres Shopify et route vers les bonnes pages

### 4. Template Shopify
- `shopify-theme-template.liquid` - Template à copier dans Shopify

## 🔧 Configuration dans Shopify

### Étape 1 : Modifier le layout principal

1. Dans Shopify : **Thème** → **Modifier le code**
2. Ouvrez **layout** → **theme.liquid**
3. **Remplacez tout le contenu** par le contenu du fichier `shopify-theme-template.liquid`
4. **Important** : Modifiez l'URL dans le template :
   ```liquid
   {% assign app_url = 'https://chiennete-production.up.railway.app' %}
   ```
   Remplacez par votre URL Railway si différente.

5. Enregistrez

### Étape 2 : Vérifier que tout fonctionne

1. **Page d'accueil** : Devrait afficher votre app React
2. **Page produit** : Cliquez sur un produit → Devrait afficher la page produit avec votre design
3. **Page article** : Devrait afficher la page article (une fois implémentée)

## 🎨 Personnalisation

### Modifier le design de la page produit

Éditez `app/product/[handle]/page.tsx` pour personnaliser :
- Layout
- Couleurs
- Typographie
- Images
- Bouton d'ajout au panier

### Ajouter la fonctionnalité articles

Pour récupérer les articles depuis Shopify, ajoutez dans `lib/shopify.ts` :

```typescript
export async function getArticleByHandle(handle: string) {
  // Implémentez la requête GraphQL pour récupérer un article
  // Similaire à getProductByHandle
}
```

Puis modifiez `app/article/[handle]/page.tsx` pour utiliser cette fonction.

## 🔄 Comment ça fonctionne

1. **Shopify charge le template** `theme.liquid`
2. **Le template charge l'iframe** avec votre app React + paramètres :
   - `shopify_template` : type de page (index, product, article)
   - `shopify_handle` : handle du produit/article
3. **Votre app React détecte les paramètres** via `ShopifyRouter`
4. **L'app route automatiquement** vers `/product/[handle]` ou `/article/[handle]`
5. **La page affiche le contenu** avec votre design

## 📝 Exemple d'URL générée

- **Page d'accueil** : `https://chiennete-production.up.railway.app?shopify_template=index`
- **Page produit** : `https://chiennete-production.up.railway.app?shopify_template=product&shopify_handle=mon-produit`
- **Page article** : `https://chiennete-production.up.railway.app?shopify_template=article&shopify_handle=mon-article`

## ✅ Vérifications

- [ ] Template `theme.liquid` modifié dans Shopify
- [ ] URL Railway correcte dans le template
- [ ] Page d'accueil affiche votre app
- [ ] Page produit affiche le design personnalisé
- [ ] Les images des produits s'affichent correctement
- [ ] Le prix s'affiche correctement

## 🐛 Dépannage

### L'iframe ne s'affiche pas
- Vérifiez que l'URL Railway est correcte
- Vérifiez que votre app est bien déployée

### La page produit ne s'affiche pas
- Vérifiez que `getProductByHandle` fonctionne
- Vérifiez les logs de votre app Railway
- Vérifiez que le handle du produit est correct

### Le routing ne fonctionne pas
- Vérifiez que `ShopifyRouter` est bien utilisé dans `app/page.tsx`
- Vérifiez les paramètres dans l'URL de l'iframe

## 🚀 Prochaines étapes

1. Personnalisez le design des pages produit/article
2. Ajoutez la fonctionnalité panier (si nécessaire)
3. Implémentez la récupération des articles
4. Ajoutez d'autres types de pages (collections, etc.)

