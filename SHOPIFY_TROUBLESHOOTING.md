# Dépannage - Application React non visible dans Shopify

## 🔍 Vérifications à faire

### 1. Vérifier que le template theme.liquid est modifié

1. Dans Shopify Admin : **En ligne** → **Thèmes**
2. Cliquez sur **Modifier le code** (ou les 3 points → Modifier le code)
3. Ouvrez **layout** → **theme.liquid**
4. Vérifiez que le contenu correspond au fichier `shopify-theme-template.liquid`

**Si le fichier n'est pas modifié :**
- Remplacez TOUT le contenu par le contenu de `shopify-theme-template.liquid`
- **Important** : Vérifiez que l'URL est correcte :
  ```liquid
  {% assign app_url = 'https://chiennete-production.up.railway.app' %}
  ```
- Enregistrez

### 2. Vérifier que l'application est déployée sur Railway

1. Allez sur [railway.app](https://railway.app)
2. Vérifiez que votre application est bien déployée
3. Vérifiez l'URL de déploiement (elle doit correspondre à celle dans `theme.liquid`)
4. Testez l'URL directement dans le navigateur : `https://chiennete-production.up.railway.app`

### 3. Vérifier la console du navigateur

1. Ouvrez votre site Shopify
2. Appuyez sur **F12** (ou Cmd+Option+I sur Mac)
3. Allez dans l'onglet **Console**
4. Cherchez les erreurs :
   - Erreurs CORS
   - Erreurs de chargement de l'iframe
   - Erreurs 404

### 4. Vérifier les logs Railway

1. Dans Railway, ouvrez votre projet
2. Allez dans l'onglet **Deployments**
3. Cliquez sur le dernier déploiement
4. Vérifiez les logs pour voir s'il y a des erreurs

## 🛠️ Solutions courantes

### Problème : L'iframe ne charge pas

**Solution 1 : Vérifier l'URL**
```liquid
{% assign app_url = 'https://chiennete-production.up.railway.app' %}
```
Assurez-vous que cette URL est correcte et accessible.

**Solution 2 : Ajouter des logs de débogage**
Ajoutez temporairement dans `theme.liquid` :
```liquid
<script>
  console.log('App URL:', '{{ full_url }}');
</script>
```

### Problème : Erreur CORS

Si vous voyez une erreur CORS dans la console :
1. Vérifiez que votre app Railway accepte les requêtes depuis votre domaine Shopify
2. Dans `next.config.ts`, ajoutez :
```typescript
headers: async () => {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'ALLOWALL' },
        { key: 'Content-Security-Policy', value: "frame-ancestors *" },
      ],
    },
  ];
},
```

### Problème : Page blanche

1. Vérifiez que l'URL dans l'iframe est correcte
2. Testez l'URL directement : `https://chiennete-production.up.railway.app?shopify_template=index`
3. Vérifiez les logs Railway pour voir les erreurs

## 📋 Checklist de vérification

- [ ] Template `theme.liquid` modifié dans Shopify
- [ ] URL Railway correcte dans le template
- [ ] Application déployée sur Railway
- [ ] URL Railway accessible directement dans le navigateur
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Pas d'erreurs dans les logs Railway
- [ ] Variables d'environnement configurées dans Railway

## 🔄 Réinitialisation complète

Si rien ne fonctionne, réinitialisez :

1. **Dans Shopify** :
   - Ouvrez `theme.liquid`
   - Supprimez tout le contenu
   - Copiez-collez le contenu de `shopify-theme-template.liquid`
   - Vérifiez l'URL
   - Enregistrez

2. **Dans Railway** :
   - Vérifiez que l'application est bien déployée
   - Vérifiez les variables d'environnement
   - Redéployez si nécessaire

3. **Testez** :
   - Ouvrez votre site Shopify en navigation privée
   - Vérifiez la console du navigateur
   - Vérifiez les logs Railway

