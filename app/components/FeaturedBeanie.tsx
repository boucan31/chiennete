'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';

interface Variant {
  id: string;
  title: string;
  formattedPrice: string;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: {
    src: string;
    alt: string;
  };
}

interface Product {
  id: string;
  title: string;
  handle: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
  variants: Variant[];
}

interface FeaturedBeanieProps {
  initialProduct: Product | null;
}

// Mapping des noms de couleurs vers des codes couleur hex
const colorMap: Record<string, string> = {
  'noir': '#000000',
  'black': '#000000',
  'blanc': '#FFFFFF',
  'white': '#FFFFFF',
  'gris': '#808080',
  'gray': '#808080',
  'grey': '#808080',
  'rouge': '#FF0000',
  'red': '#FF0000',
  'bleu': '#0000FF',
  'blue': '#0000FF',
  'vert': '#1848',
  'green': '#1848',
  'jaune': '#FFFF00',
  'yellow': '#FFFF00',
  'orange': '#FFA500',
  'rose': '#FFC0CB',
  'pink': '#FFC0CB',
  'violet': '#800080',
  'purple': '#800080',
  'marron': '#8B4513',
  'brown': '#8B4513',
};

// Mapping couleur → handle du produit
const colorToProductHandle: Record<string, string> = {
  'blanc': 'white-drop-2025',
  'white': 'white-drop-2025',
  'gris': 'grey-drop-2025',
  'gray': 'grey-drop-2025',
  'grey': 'grey-drop-2025',
  'vert': 'green-drop-2025',
  'green': 'green-drop-2025',
  'noir': 'black-drop-2025',
  'black': 'black-drop-2025',
};

// Couleurs disponibles
const availableColors = ['blanc', 'gris', 'vert'];

// Fonction pour obtenir la couleur hex depuis le nom de couleur
const getColorHex = (colorName: string): string => {
  const normalized = colorName.toLowerCase().trim();
  return colorMap[normalized] || '#CCCCCC'; // Couleur par défaut si non trouvée
};

export default function FeaturedBeanie({ initialProduct }: FeaturedBeanieProps) {
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || 'blanc');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(initialProduct);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productCache, setProductCache] = useState<Record<string, Product>>(
    initialProduct ? { [selectedColor]: initialProduct } : {}
  );

  // Charger le produit correspondant à la couleur sélectionnée
  useEffect(() => {
    const loadProduct = async () => {
      // Si le produit est déjà en cache, l'utiliser
      if (productCache[selectedColor]) {
        setCurrentProduct(productCache[selectedColor]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const handle = colorToProductHandle[selectedColor];
        if (!handle) {
          throw new Error(`Aucun produit trouvé pour la couleur: ${selectedColor}`);
        }

        // Encoder le handle pour l'URL (les espaces et caractères spéciaux sont encodés dans l'URL)
        const encodedHandle = encodeURIComponent(handle);
        console.log(`[FeaturedBeanie] Fetching product with handle: "${handle}" (encoded: "${encodedHandle}")`);
        console.log(`[FeaturedBeanie] Full URL: /api/product/${encodedHandle}`);
        const response = await fetch(`/api/product/${encodedHandle}`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[FeaturedBeanie] Error response:`, response.status, response.statusText, errorText);
          throw new Error(`Erreur lors du chargement du produit: ${response.statusText} (${response.status})`);
        }

        const product = await response.json();
        
        if (!product || !product.id) {
          throw new Error('Produit non trouvé');
        }

        // Mettre en cache le produit
        setProductCache(prev => ({
          ...prev,
          [selectedColor]: product,
        }));

        setCurrentProduct(product);
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du produit');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [selectedColor, productCache]);

  // État pour la taille sélectionnée
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Filtrer les variantes disponibles pour le produit actuel
  const availableVariants = currentProduct?.variants?.filter(v => v.availableForSale) || [];
  
  // Debug: afficher toutes les variantes disponibles
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('All variants:', currentProduct?.variants);
    console.log('Available variants:', availableVariants);
    availableVariants.forEach((v, i) => {
      const sizeOpt = v.selectedOptions.find(opt => 
        opt.name.toLowerCase() === 'taille' || opt.name.toLowerCase() === 'size'
      );
      console.log(`Variant ${i}:`, {
        id: v.id,
        title: v.title,
        size: sizeOpt?.value,
        available: v.availableForSale,
        options: v.selectedOptions
      });
    });
  }
  
  // Grouper les variantes par taille pour éviter les doublons
  const uniqueVariantsBySize = useMemo(() => {
    const grouped: Record<string, Variant> = {};
    
    // Parcourir toutes les variantes disponibles
    availableVariants.forEach((variant) => {
      const sizeOption = variant.selectedOptions.find(opt => 
        opt.name.toLowerCase() === 'taille' || 
        opt.name.toLowerCase() === 'size' ||
        opt.name.toLowerCase() === 'tailles'
      );
      let size = sizeOption?.value;
      if (!size) {
        const titleParts = variant.title.split('/');
        size = titleParts.length > 1 ? titleParts[titleParts.length - 1].trim() : variant.title;
      }
      // Normaliser la taille (mettre en majuscules pour la comparaison)
      const normalizedSize = size.toUpperCase().trim();
      
      // Toujours garder la variante si elle n'existe pas encore dans le groupe
      // OU si c'est la variante actuellement sélectionnée (pour préserver la sélection)
      if (!grouped[normalizedSize]) {
        grouped[normalizedSize] = variant;
      } else if (variant.id === selectedSize) {
        // Si c'est la variante sélectionnée, la remplacer pour garder la bonne sélection
        grouped[normalizedSize] = variant;
      }
    });
    
    // Debug: afficher les tailles groupées
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('Grouped variants by size:', Object.keys(grouped));
      Object.entries(grouped).forEach(([size, variant]) => {
        console.log(`Size ${size}:`, variant.id, variant.title);
      });
    }
    
    // Trier les variantes par taille (XS, S, M, L, XL, XXL, etc.)
    const sizeOrder: Record<string, number> = {
      'XXS': 0, 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6, 'XXXL': 7
    };
    return Object.values(grouped).sort((a, b) => {
      const sizeA = a.selectedOptions.find(opt => 
        opt.name.toLowerCase() === 'taille' || opt.name.toLowerCase() === 'size'
      )?.value?.toUpperCase() || a.title.split('/').pop()?.trim().toUpperCase() || '';
      const sizeB = b.selectedOptions.find(opt => 
        opt.name.toLowerCase() === 'taille' || opt.name.toLowerCase() === 'size'
      )?.value?.toUpperCase() || b.title.split('/').pop()?.trim().toUpperCase() || '';
      const orderA = sizeOrder[sizeA] ?? 99;
      const orderB = sizeOrder[sizeB] ?? 99;
      return orderA - orderB;
    });
  }, [availableVariants, selectedSize]);
  
  // Initialiser/réinitialiser la taille sélectionnée quand le produit change
  useEffect(() => {
    if (currentProduct && currentProduct.variants) {
      const variants = currentProduct.variants.filter(v => v.availableForSale);
      if (variants.length > 0) {
        // Réinitialiser la taille quand on change de couleur/produit
        const currentVariant = variants.find(v => v.id === selectedSize);
        if (!currentVariant) {
          // Si la variante précédemment sélectionnée n'existe plus, prendre la première disponible
          setSelectedSize(variants[0].id);
        }
      }
    }
  }, [currentProduct?.id, selectedSize]); // Utiliser currentProduct?.id au lieu de currentProduct pour éviter les changements de référence

  // Trouver la variante sélectionnée
  const selectedVariant = availableVariants.find(v => v.id === selectedSize) || availableVariants[0] || null;

  // Trouver l'image correspondant à la variante sélectionnée
  const getCurrentImage = () => {
    if (!currentProduct) return { src: '', alt: '' };
    
    if (selectedVariant?.image?.src) {
      return {
        src: selectedVariant.image.src,
        alt: selectedVariant.image.alt || currentProduct.title,
      };
    }
    
    return currentProduct.images[0] || { src: '', alt: currentProduct.title };
  };

  const currentImage = getCurrentImage();

  // Ne rien afficher si le produit n'existe pas et qu'il n'y a pas d'erreur (produit non trouvé)
  if (!currentProduct && !isLoading && !error) {
    return null;
  }

  // Ne rien afficher si le produit n'existe pas après le chargement (produit non trouvé dans Shopify)
  if (!currentProduct && !isLoading && error && error.includes('not found')) {
    return null;
  }

  return (
    <section className="py-20 px-6 bg-transparent">
      <div className="max-w-[600px] mx-auto">
        {/* Image principale */}
        {currentProduct && (
          <Link href={`/product/${currentProduct.handle}`} className="block">
            <div className="aspect-square relative bg-[#111111] overflow-hidden mb-8 cursor-pointer hover:opacity-90 transition-opacity">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : currentImage.src ? (
                <Image
                  key={selectedColor} // Key pour forcer le re-render lors du changement de couleur
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, 600px"
                  priority
                />
              ) : null}
            </div>
          </Link>
        )}
        {!currentProduct && (
          <div className="aspect-square relative bg-[#111111] overflow-hidden mb-8">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : null}
          </div>
        )}

        {/* Titre et prix */}
        <div className="text-center mb-8">
          {isLoading ? (
            <div className="h-12 bg-[#111111] rounded mb-4 animate-pulse"></div>
          ) : (
            <>
              {currentProduct ? (
                <Link href={`/product/${currentProduct.handle}`} className="block cursor-pointer hover:opacity-80 transition-opacity">
                  <h2 className="font-['Dela_Gothic_One',sans-serif] text-3xl md:text-4xl mb-4">
                    {currentProduct.title}
                  </h2>
                </Link>
              ) : (
                <h2 className="font-['Dela_Gothic_One',sans-serif] text-3xl md:text-4xl mb-4">
                  Chargement...
                </h2>
              )}
              {selectedVariant && (
                <p className="font-['Dela_Gothic_One',sans-serif] text-2xl bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
                  {selectedVariant.formattedPrice}
                </p>
              )}
            </>
          )}
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-8 text-center">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Sélecteur de couleurs rond */}
        <div className="mb-8">
          <label className="block text-base mb-6 text-white font-medium text-center">
            Couleur
          </label>
          <div className="flex flex-wrap justify-center gap-5">
            {availableColors.map((color) => {
              const isSelected = selectedColor === color;
              const colorHex = getColorHex(color);
              
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={isLoading}
                  className={`relative w-16 h-16 rounded-full border-4 transition-all ${
                    isSelected
                      ? 'border-white scale-125 shadow-[0_0_20px_rgba(255,255,255,0.6)]'
                      : 'border-[#666666] hover:border-white hover:scale-110'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{
                    backgroundColor: colorHex,
                  }}
                  title={color}
                  aria-label={`Sélectionner la couleur ${color}`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white shadow-lg"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sélecteur de taille */}
        {uniqueVariantsBySize.length > 1 && !isLoading && (
          <div className="mb-8">
            <label className="block text-base mb-6 text-white font-medium text-center">
              Taille
            </label>
            <div className="flex flex-wrap justify-center gap-3">
              {uniqueVariantsBySize.map((variant) => {
                const sizeOption = variant.selectedOptions.find(opt => 
                  opt.name.toLowerCase() === 'taille' || 
                  opt.name.toLowerCase() === 'size' ||
                  opt.name.toLowerCase() === 'tailles'
                );
                let size = sizeOption?.value;
                if (!size) {
                  const titleParts = variant.title.split('/');
                  size = titleParts.length > 1 ? titleParts[titleParts.length - 1].trim() : variant.title;
                }
                const isSelected = selectedSize === variant.id;
                
                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedSize(variant.id)}
                    disabled={!variant.availableForSale}
                    className={`px-8 py-4 font-['IBM_Plex_Mono',monospace] text-base font-semibold border-2 transition-all ${
                      isSelected
                        ? 'border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105'
                        : variant.availableForSale
                        ? 'border-[#666666] bg-[#111111] text-white hover:border-white hover:bg-[#1a1a1a]'
                        : 'border-[#2a2a2a] bg-[#111111] text-[#666666] opacity-50 cursor-not-allowed'
                    }`}
                    style={{
                      borderWidth: isSelected ? '3px' : '2px',
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bouton ajouter au panier */}
        {selectedVariant && !isLoading && (
          <AddToCartButton
            variantId={selectedVariant.id}
            productTitle={currentProduct?.title || ''}
            available={selectedVariant.availableForSale}
          />
        )}
      </div>
    </section>
  );
}
