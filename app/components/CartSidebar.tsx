'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Cart, CartLine } from '@/lib/shopify-cart';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartKey, setCartKey] = useState(0); // Clé pour forcer le re-render
  const isFetchingRef = useRef(false);

  const fetchCart = useCallback(async () => {
    // Éviter les appels multiples simultanés
    if (isFetchingRef.current) {
      return;
    }

    // Toujours lire le cartId depuis localStorage au moment de l'appel
    // pour s'assurer d'avoir la dernière valeur
    const cartId = typeof window !== 'undefined' ? localStorage.getItem('shopify_cart_id') : null;
    
    if (!cartId) {
      setCart(null);
      setLoading(false);
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Ajouter un timestamp pour éviter le cache, surtout dans un iframe
      const timestamp = Date.now();
      const response = await fetch(`/api/cart/get?cartId=${encodeURIComponent(cartId)}&_t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la récupération du panier');
      }

      // S'assurer que les données sont valides avant de mettre à jour
      if (data.cart) {
        // Forcer une nouvelle référence pour que React détecte le changement
        const cartData = JSON.parse(JSON.stringify(data.cart));
        console.log('Setting cart data:', {
          totalQuantity: cartData.totalQuantity,
          linesCount: cartData.lines?.edges?.length || 0,
          totalAmount: cartData.cost?.totalAmount?.amount,
          lines: cartData.lines?.edges?.map((e: any) => ({
            id: e.node?.id,
            quantity: e.node?.quantity,
            price: e.node?.merchandise?.price?.amount,
            cost: e.node?.cost?.totalAmount?.amount,
          })),
        });
        setCart(cartData);
        // Incrémenter la clé pour forcer le re-render
        setCartKey(prev => prev + 1);
      } else {
        console.warn('No cart data received');
        setCart(null);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setCart(null);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Ajouter/retirer la classe au body pour pousser le contenu
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('cart-open');
    } else {
      document.body.classList.remove('cart-open');
    }

    return () => {
      document.body.classList.remove('cart-open');
    };
  }, [isOpen]);

  // Écouter l'événement cartUpdated pour rafraîchir le panier
  useEffect(() => {
    let refreshTimer: NodeJS.Timeout | null = null;
    
    const handleCartUpdate = (event: Event) => {
      // Si le panier est ouvert, le rafraîchir
      if (isOpen) {
        // Annuler le timer précédent s'il existe pour éviter les rafraîchissements multiples
        if (refreshTimer) {
          clearTimeout(refreshTimer);
        }
        
        // Vérifier si le panier est directement fourni dans l'événement (plus rapide)
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.cart) {
          // Forcer une nouvelle référence pour que React détecte le changement
          const cartData = JSON.parse(JSON.stringify(customEvent.detail.cart));
          console.log('Received cart directly from event:', {
            totalQuantity: cartData.totalQuantity,
            linesCount: cartData.lines?.edges?.length || 0,
            totalAmount: cartData.cost?.totalAmount?.amount,
            firstLineQuantity: cartData.lines?.edges?.[0]?.node?.quantity,
            firstLinePrice: cartData.lines?.edges?.[0]?.node?.merchandise?.price?.amount,
          });
          // Utiliser directement le panier reçu sans faire d'appel API
          setCart(cartData);
          // Incrémenter la clé pour forcer le re-render
          setCartKey(prev => prev + 1);
          setLoading(false);
          isFetchingRef.current = false;
          return;
        }
        
        // Sinon, récupérer le panier via API
        // Détecter si on est dans un iframe
        const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
        
        // Dans un iframe, attendre un peu plus longtemps pour laisser Shopify synchroniser
        const delay = isInIframe ? 1000 : 400;
        
        refreshTimer = setTimeout(() => {
          fetchCart();
        }, delay);
      }
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, [isOpen, fetchCart]);

  // Rafraîchir le panier quand il s'ouvre
  useEffect(() => {
    if (isOpen) {
      // Détecter si on est dans un iframe
      const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
      
      // Dans un iframe, attendre un peu plus longtemps pour laisser Shopify synchroniser
      const delay = isInIframe ? 800 : 200;
      
      const timer = setTimeout(() => {
        fetchCart();
      }, delay);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOpen, fetchCart]);

  // Debug: surveiller les changements du panier
  useEffect(() => {
    if (cart) {
      console.log('Cart state updated:', {
        totalQuantity: cart.totalQuantity,
        totalAmount: cart.cost?.totalAmount?.amount,
        lines: cart.lines?.edges?.map((e: any) => ({
          quantity: e.node?.quantity,
          price: e.node?.merchandise?.price?.amount,
          cost: e.node?.cost?.totalAmount?.amount,
        })),
      });
    }
  }, [cart]);

  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    const cartId = typeof window !== 'undefined' ? localStorage.getItem('shopify_cart_id') : null;
    if (!cartId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId,
          lineId,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      // Mettre à jour immédiatement avec les données reçues
      if (data.cart) {
        // Forcer une nouvelle référence pour que React détecte le changement
        const cartData = JSON.parse(JSON.stringify(data.cart));
        
        // Log détaillé pour déboguer
        const updatedLine = cartData.lines?.edges?.find((e: any) => e.node?.id === lineId)?.node;
        console.log('Updated cart from handleUpdateQuantity:', {
          totalQuantity: cartData.totalQuantity,
          lineId,
          lineQuantity: updatedLine?.quantity,
          linePrice: updatedLine?.merchandise?.price?.amount,
          lineCost: updatedLine?.cost?.totalAmount?.amount,
          hasPrice: !!updatedLine?.merchandise?.price?.amount,
          hasCost: !!updatedLine?.cost?.totalAmount?.amount,
          cartStructure: {
            hasLines: !!cartData.lines,
            hasEdges: !!cartData.lines?.edges,
            edgesLength: cartData.lines?.edges?.length || 0,
          },
        });
        
        // Mettre à jour le state immédiatement
        setCart(cartData);
        setCartKey(prev => prev + 1);
        
        // Si on est dans un iframe, faire un refresh après un délai pour synchroniser
        const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
        if (isInIframe) {
          // Dans un iframe, attendre un peu plus longtemps pour laisser Shopify synchroniser
          setTimeout(() => {
            fetchCart();
          }, 1500);
        }
      } else {
        // Si pas de cart dans la réponse, récupérer le panier complet
        console.warn('No cart in update response, fetching full cart');
        const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
        const delay = isInIframe ? 1000 : 400;
        setTimeout(() => {
          fetchCart();
        }, delay);
      }
      
      // Déclencher l'événement cartUpdated pour synchroniser avec d'autres composants
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    const cartId = typeof window !== 'undefined' ? localStorage.getItem('shopify_cart_id') : null;
    if (!cartId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId,
          lineId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      // Forcer une nouvelle référence pour que React détecte le changement
      if (data.cart) {
        const cartData = JSON.parse(JSON.stringify(data.cart));
        console.log('Updated cart from handleRemoveItem:', {
          totalQuantity: cartData.totalQuantity,
          linesCount: cartData.lines?.edges?.length || 0,
        });
        setCart(cartData);
        setCartKey(prev => prev + 1);
      }
      
      // Si le panier est vide, supprimer le cartId du localStorage
      if (data.cart && data.cart.totalQuantity === 0) {
        localStorage.removeItem('shopify_cart_id');
      }
      
      // Rafraîchir le panier pour être sûr d'avoir les données les plus récentes
      // Détecter si on est dans un iframe
      const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
      const delay = isInIframe ? 1000 : 400;
      
      setTimeout(() => {
        fetchCart();
      }, delay);

      // Déclencher l'événement cartUpdated
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.open(cart.checkoutUrl, '_blank');
    }
  };

  const formatPrice = (amount: string | undefined, currencyCode: string | undefined) => {
    if (!amount || !currencyCode) {
      return 'N/A';
    }
    const price = parseFloat(amount);
    if (isNaN(price)) {
      return 'N/A';
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currencyCode,
    }).format(price);
  };

  const getProductImage = (line: CartLine) => {
    return line.merchandise.product.images.edges[0]?.node?.url || '';
  };

  const getVariantTitle = (line: CartLine) => {
    const options = line.merchandise.selectedOptions
      .filter(opt => opt.name !== 'Title')
      .map(opt => opt.value)
      .join(' / ');
    return options || '';
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-[#111111] z-[2000] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col border-l border-[#2a2a2a] overflow-y-auto`}
        style={{
          boxShadow: isOpen ? '-4px 0 20px rgba(0, 0, 0, 0.5)' : 'none',
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
          <h2 className="font-['Dela_Gothic_One',sans-serif] text-2xl tracking-wider uppercase text-white">
            Panier
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#999999] transition-colors p-2"
            aria-label="Fermer le panier"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && !cart && (
            <div className="flex items-center justify-center h-full">
              <p className="text-[#999999] font-['IBM_Plex_Mono',monospace] text-sm">
                Chargement...
              </p>
            </div>
          )}

          {error && (
            <div className="p-6">
              <p className="text-red-500 font-['IBM_Plex_Mono',monospace] text-sm">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && (!cart || cart.totalQuantity === 0) && (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <p className="text-[#666666] font-['IBM_Plex_Mono',monospace] text-sm mb-4">
                Votre panier est vide
              </p>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-green-500 to-yellow-500 text-black font-['Dela_Gothic_One',sans-serif] py-3 px-6 text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Continuer vos achats
              </button>
            </div>
          )}

          {!loading && cart && cart.totalQuantity > 0 && (
            <div key={`cart-content-${cartKey}`} className="p-6 space-y-6">
              {cart.lines && cart.lines.edges && cart.lines.edges.length > 0 ? (
                cart.lines.edges.map(({ node: line }) => (
                <div
                  key={line.id}
                  className="flex gap-4 pb-6 border-b border-[#2a2a2a] last:border-0"
                >
                  {/* Image */}
                  <div className="relative w-24 h-24 bg-black flex-shrink-0">
                    {getProductImage(line) ? (
                      <Image
                        src={getProductImage(line)}
                        alt={line.merchandise.product.images.edges[0]?.node?.altText || line.merchandise.product.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
                        <span className="text-[#666666] text-xs font-['IBM_Plex_Mono',monospace]">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-['IBM_Plex_Mono',monospace] text-sm text-white mb-1 truncate">
                      {line.merchandise.product.title}
                    </h3>
                    {getVariantTitle(line) && (
                      <p className="font-['IBM_Plex_Mono',monospace] text-xs text-[#666666] mb-2">
                        {getVariantTitle(line)}
                      </p>
                    )}
                    <p 
                      key={`price-${line.id}-${line.merchandise?.price?.amount}-${cartKey}`}
                      className="font-['IBM_Plex_Mono',monospace] text-sm text-white mb-3"
                    >
                      {line.merchandise?.price?.amount 
                        ? formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)
                        : 'Prix non disponible'}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={() => handleUpdateQuantity(line.id, (line.quantity || 1) - 1)}
                        disabled={loading || isFetchingRef.current}
                        className="w-8 h-8 border border-[#2a2a2a] text-white hover:border-[#666666] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['IBM_Plex_Mono',monospace] text-sm"
                        aria-label="Réduire la quantité"
                      >
                        −
                      </button>
                      <span 
                        key={`quantity-${line.id}-${line.quantity}-${cartKey}`}
                        className="font-['IBM_Plex_Mono',monospace] text-sm text-white min-w-[2rem] text-center"
                      >
                        {line.quantity ?? 0}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)}
                        disabled={loading}
                        className="w-8 h-8 border border-[#2a2a2a] text-white hover:border-[#666666] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['IBM_Plex_Mono',monospace] text-sm"
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveItem(line.id)}
                      disabled={loading}
                      className="text-[#666666] hover:text-red-500 transition-colors font-['IBM_Plex_Mono',monospace] text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Supprimer
                    </button>
                  </div>

                  {/* Total per line */}
                  <div className="text-right flex-shrink-0">
                    <p 
                      key={`total-${line.id}-${line.cost?.totalAmount?.amount}-${line.quantity}-${cartKey}`}
                      className="font-['IBM_Plex_Mono',monospace] text-sm text-white"
                    >
                      {line.cost?.totalAmount?.amount
                        ? formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-[#666666] font-['IBM_Plex_Mono',monospace] text-sm">
                    Aucun article dans le panier
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.totalQuantity > 0 && (
          <div className="border-t border-[#2a2a2a] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-['IBM_Plex_Mono',monospace] text-sm text-[#666666] uppercase tracking-wider">
                Total
              </span>
              <span 
                key={`cart-total-${cart.cost?.totalAmount?.amount}-${cart.totalQuantity}-${cartKey}`}
                className="font-['Dela_Gothic_One',sans-serif] text-xl text-white"
              >
                {cart.cost?.totalAmount?.amount
                  ? formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)
                  : 'N/A'}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-black font-['Dela_Gothic_One',sans-serif] py-4 px-8 text-lg uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Passer la commande
            </button>
          </div>
        )}
      </div>

    </>
  );
}

