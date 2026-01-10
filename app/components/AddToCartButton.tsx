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

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'ajout au panier');
      }

      // Sauvegarder le cartId
      if (data.cartId && typeof window !== 'undefined') {
        localStorage.setItem('shopify_cart_id', data.cartId);
      }

      // Déclencher les événements pour ouvrir et rafraîchir le panier
      if (typeof window !== 'undefined') {
        // D'abord ouvrir le panier
        window.dispatchEvent(new CustomEvent('openCart'));
        
        // Puis déclencher cartUpdated après un délai pour :
        // 1. Laisser le panier s'ouvrir complètement
        // 2. Laisser Shopify mettre à jour le panier côté serveur
        // Augmenter le délai pour s'assurer que Shopify a bien synchronisé
        setTimeout(() => {
          console.log('Dispatching cartUpdated event with cartId:', data.cartId);
          window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { cartId: data.cartId } 
          }));
        }, 800);
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
          className={`mt-4 p-3 text-center text-sm ${
            message.startsWith('✅')
              ? 'bg-green-500/20 text-green-500 border border-green-500/50'
              : 'bg-red-500/20 text-red-500 border border-red-500/50'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

