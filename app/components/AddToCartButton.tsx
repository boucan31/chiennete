'use client';

import { useState } from 'react';

interface AddToCartButtonProps {
  variantId: string;
  productTitle: string;
}

export default function AddToCartButton({ variantId, productTitle }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddToCart = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Récupérer le cartId depuis localStorage s'il existe
      const existingCartId = typeof window !== 'undefined' ? localStorage.getItem('shopify_cart_id') : null;

      if (!variantId) {
        throw new Error('ID de variante manquant');
      }

      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId,
          quantity: 1,
          cartId: existingCartId,
        }),
      });

      if (!response) {
        throw new Error('Pas de réponse du serveur');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Erreur lors du parsing de la réponse:', parseError);
        throw new Error('Réponse invalide du serveur');
      }

      if (!response.ok || !data.success) {
        // Afficher "article épuisé" si l'erreur indique que l'article n'est pas disponible
        const errorMessage = data.error || 'Erreur lors de l\'ajout au panier';
        const unavailableKeywords = [
          'unavailable',
          'not available',
          'out of stock',
          'sold out',
          'not found',
          'does not exist',
          'invalid',
          'épuisé',
          'indisponible',
          'n\'existe pas',
          'introuvable',
          'article épuisé'
        ];
        
        const isUnavailable = unavailableKeywords.some(keyword => 
          errorMessage.toLowerCase().includes(keyword.toLowerCase())
        );
        
        throw new Error(isUnavailable ? 'article épuisé' : errorMessage);
      }

      // Vérifier que nous avons bien un cartId
      if (!data.cartId) {
        throw new Error('Aucun ID de panier retourné');
      }

      // Sauvegarder le cartId
      if (typeof window !== 'undefined' && data.cartId) {
        try {
          localStorage.setItem('shopify_cart_id', data.cartId);
        } catch (storageError) {
          console.warn('Impossible de sauvegarder le cartId dans localStorage:', storageError);
        }
      }

      // Déclencher les événements pour ouvrir et rafraîchir le panier
      if (typeof window !== 'undefined') {
        try {
          // Détecter si on est dans un iframe (Shopify)
          const isInIframe = window.self !== window.top;
          
          // D'abord ouvrir le panier
          window.dispatchEvent(new CustomEvent('openCart'));
          
          // Si on a reçu le panier complet directement, l'envoyer avec l'événement
          // Sinon, déclencher cartUpdated pour le récupérer
          if (data.cart) {
            // Envoyer le panier directement avec l'événement pour éviter un appel API supplémentaire
            setTimeout(() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('cartUpdated', { 
                  detail: { cartId: data.cartId, cart: data.cart } 
                }));
              }
            }, isInIframe ? 500 : 300);
          } else {
            // Fallback : déclencher cartUpdated pour récupérer le panier
            setTimeout(() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('cartUpdated', { 
                  detail: { cartId: data.cartId } 
                }));
              }
            }, isInIframe ? 1500 : 800);
          }
        } catch (eventError) {
          console.error('Erreur lors du déclenchement des événements:', eventError);
        }
      }

      // Afficher un message (ne plus rediriger automatiquement vers checkout)
      setMessage('✅ Ajouté au panier !');
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage(error instanceof Error ? error.message : 'Erreur lors de l\'ajout au panier');
    } finally {
      setLoading(false);
      // Effacer le message après 3 secondes
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-black font-['Dela_Gothic_One',sans-serif] py-4 px-8 text-lg uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Ajout en cours...' : 'Ajouter au panier'}
      </button>
      {message && (
        <div
          className={`mt-4 p-3 text-center text-sm font-['IBM_Plex_Mono',monospace] ${
            message.startsWith('✅')
              ? 'bg-green-500/20 text-green-500 border border-green-500/50'
              : message.toLowerCase().includes('article épuisé') || message.toLowerCase().includes('épuisé')
              ? 'bg-orange-500/20 text-orange-500 border border-orange-500/50'
              : 'bg-red-500/20 text-red-500 border border-red-500/50'
          }`}
        >
          {message.toLowerCase().includes('article épuisé') || message.toLowerCase().includes('épuisé')
            ? '⚠️ Article épuisé'
            : message}
        </div>
      )}
    </div>
  );
}

