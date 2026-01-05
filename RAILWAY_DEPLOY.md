# Guide de déploiement Railway - Étapes détaillées

## 🚀 Méthode 1 : Via l'interface web (Recommandé)

### 1. Préparer votre code
```bash
# Votre code est déjà sur GitHub ✅
git push origin main
```

### 2. Créer un compte Railway
- Allez sur https://railway.app
- Cliquez sur "Start a New Project"
- Connectez-vous avec GitHub (recommandé)

### 3. Connecter votre repository
- Cliquez sur "Deploy from GitHub repo"
- Autorisez Railway à accéder à vos repositories
- Sélectionnez `boucan31/chiennete`
- Railway détectera automatiquement Next.js

### 4. Configurer les variables d'environnement
Dans votre projet Railway :

1. Cliquez sur votre service (Next.js)
2. Allez dans l'onglet **"Variables"**
3. Cliquez sur **"New Variable"**
4. Ajoutez ces variables une par une :

**Variable 1:**
- Name: `SHOPIFY_STORE_DOMAIN`
- Value: `votre-boutique.myshopify.com` (remplacez par votre domaine)

**Variable 2:**
- Name: `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- Value: `votre_token_storefront` (remplacez par votre token)

### 5. Obtenir le Storefront Access Token Shopify

1. Connectez-vous à https://admin.shopify.com
2. Allez dans **Paramètres** → **Applications et intégrations**
3. Cliquez sur **"Développer des applications"** (en bas)
4. Cliquez sur **"Créer une application"**
5. Nommez-la (ex: "LA CHIENNETÉ Storefront")
6. Cliquez sur **"Créer l'application"**
7. Dans la section **"Storefront API"**, cliquez sur **"Configurer"**
8. Cochez ces permissions :
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_read_product_tags`
9. Cliquez sur **"Enregistrer"**
10. Allez dans l'onglet **"API credentials"**
11. Cliquez sur **"Installer l'application"**
12. Copiez le **"Storefront access token"** (commence par `shpat_` ou `shpca_`)

### 6. Déploiement
- Railway redéploiera automatiquement après l'ajout des variables
- Ou cliquez sur **"Redeploy"** dans l'onglet **"Deployments"**

### 7. Obtenir votre URL
- Dans l'onglet **"Settings"** de votre service
- Cliquez sur **"Generate Domain"**
- Votre site sera accessible à `votre-projet.railway.app`

---

## 🖥️ Méthode 2 : Via Railway CLI

### 1. Installer Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Se connecter
```bash
railway login
```

### 3. Initialiser le projet
```bash
cd /Users/oliviervittori/Developpement/001_chiennete
railway init
```

### 4. Lier au repository GitHub
```bash
railway link
```

### 5. Ajouter les variables d'environnement
```bash
railway variables set SHOPIFY_STORE_DOMAIN=votre-boutique.myshopify.com
railway variables set SHOPIFY_STOREFRONT_ACCESS_TOKEN=votre_token
```

### 6. Déployer
```bash
railway up
```

---

## ✅ Vérification

Une fois déployé, votre site devrait :
- ✅ Se charger correctement
- ✅ Afficher "Aucun produit disponible" si Shopify n'est pas configuré
- ✅ Afficher vos produits Shopify une fois les variables configurées

## 🐛 Dépannage

### Le build échoue
- Vérifiez les logs dans Railway → Deployments
- Assurez-vous que Node.js 20+ est utilisé (déjà configuré dans package.json)

### Les produits ne s'affichent pas
- Vérifiez que les variables d'environnement sont correctement définies
- Vérifiez que votre token Shopify a les bonnes permissions
- Consultez les logs Railway pour voir les erreurs API

### Le site ne se charge pas
- Vérifiez que le déploiement est terminé (statut "Active")
- Vérifiez que le domaine est généré dans Settings

---

## 📚 Ressources

- [Documentation Railway](https://docs.railway.app)
- [Documentation Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Support Railway](https://railway.app/help)

