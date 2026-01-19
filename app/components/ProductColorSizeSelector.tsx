'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import ProductPrice from './ProductPrice';

interface Variant {
  id: string;
  title: string;
  formattedPrice: string;
  availableForSale?: boolean;
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

interface ProductColorSizeSelectorProps {
  initialProduct: Product;
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

// Mapping couleur → handle du produit selon le type
const getColorToHandle = (handle: string): Record<string, string> => {
  const handleLower = handle.toLowerCase();
  
  if (handleLower.includes('sweater') || handleLower.includes('sweat')) {
    return {
      'blanc': 'sweater-white-drop-2025',
      'white': 'sweater-white-drop-2025',
      'gris': 'sweater-grey-drop-2025',
      'gray': 'sweater-grey-drop-2025',
      'grey': 'sweater-grey-drop-2025',
      'noir': 'sweater-black-drop-2025',
      'black': 'sweater-black-drop-2025',
    };
  }
  
  if (handleLower.includes('t-shirt') || handleLower.includes('tshirt')) {
    return {
      'blanc': 't-shirt-white-drop-2025',
      'white': 't-shirt-white-drop-2025',
      'gris': 't-shirt-grey-drop-2025',
      'gray': 't-shirt-grey-drop-2025',
      'grey': 't-shirt-grey-drop-2025',
      'noir': 't-shirt-black-drop-2025',
      'black': 't-shirt-black-drop-2025',
    };
  }
  
  if (handleLower.includes('beanie') || handleLower.includes('bonnet')) {
    return {
      'blanc': 'white-drop-2025',
      'white': 'white-drop-2025',
      'gris': 'grey-drop-2025',
      'gray': 'grey-drop-2025',
      'grey': 'grey-drop-2025',
      'vert': 'green-drop-2025',
      'green': 'green-drop-2025',
    };
  }
  
  return {};
};

// Détecter les couleurs disponibles depuis le handle
const getAvailableColors = (handle: string): string[] => {
  const handleLower = handle.toLowerCase();
  
  if (handleLower.includes('sweater') || handleLower.includes('sweat')) {
    return ['blanc', 'gris', 'noir'];
  }
  
  if (handleLower.includes('t-shirt') || handleLower.includes('tshirt')) {
    return ['blanc', 'gris', 'noir'];
  }
  
  if (handleLower.includes('beanie') || handleLower.includes('bonnet')) {
    return ['blanc', 'gris', 'vert'];
  }
  
  return [];
};

// Fonction pour obtenir la couleur hex depuis le nom de couleur
const getColorHex = (colorName: string): string => {
  const normalized = colorName.toLowerCase().trim();
  return colorMap[normalized] || '#CCCCCC';
};

// Détecter la couleur actuelle depuis le handle
const getCurrentColorFromHandle = (handle: string): string => {
  const handleLower = handle.toLowerCase();
  if (handleLower.includes('white') || handleLower.includes('blanc')) return 'blanc';
  if (handleLower.includes('grey') || handleLower.includes('gray') || handleLower.includes('gris')) return 'gris';
  if (handleLower.includes('black') || handleLower.includes('noir')) return 'noir';
  if (handleLower.includes('green') || handleLower.includes('vert')) return 'vert';
  return 'blanc';
};

export default function ProductColorSizeSelector({ initialProduct }: ProductColorSizeSelectorProps) {
  const router = useRouter();
  const availableColors = getAvailableColors(initialProduct.handle);
  const colorToHandle = getColorToHandle(initialProduct.handle);
  const [selectedColor, setSelectedColor] = useState(getCurrentColorFromHandle(initialProduct.handle));
  const [currentProduct, setCurrentProduct] = useState<Product>(initialProduct);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [productCache, setProductCache] = useState<Record<string, Product>>({
    [selectedColor]: initialProduct
  });

  // Charger le produit correspondant à la couleur sélectionnée
  useEffect(() => {
    const loadProduct = async () => {
      // Si le produit est déjà en cache, l'utiliser
      if (productCache[selectedColor]) {
        setCurrentProduct(productCache[selectedColor]);
        return;
      }

      setIsLoading(true);

      try {
        const handle = colorToHandle[selectedColor];
        if (!handle) {
          throw new Error(`Aucun produit trouvé pour la couleur: ${selectedColor}`);
        }

        const encodedHandle = encodeURIComponent(handle);
        const response = await fetch(`/api/product/${encodedHandle}`);
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement du produit: ${response.statusText}`);
        }

        const product = await response.json();
        setCurrentProduct(product);
        setProductCache(prev => ({
          ...prev,
          [selectedColor]: product
        }));
        
        // Émettre un événement pour mettre à jour les images
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('productChanged', { detail: product }));
        }
        
        // Rediriger vers le nouveau handle pour mettre à jour l'URL
        router.replace(`/product/${handle}`);
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedColor && colorToHandle[selectedColor]) {
      loadProduct();
    }
  }, [selectedColor, colorToHandle, productCache, router]);

  // Filtrer les variantes disponibles pour le produit actuel
  const availableVariants = currentProduct?.variants?.filter(v => v.availableForSale) || [];

  // Grouper les variantes par taille pour éviter les doublons
  const uniqueVariantsBySize = useMemo(() => {
    const grouped: Record<string, Variant> = {};
    
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
      const normalizedSize = size.toUpperCase().trim();
      
      if (!grouped[normalizedSize]) {
        grouped[normalizedSize] = variant;
      }
    });
    
    return Object.values(grouped);
  }, [availableVariants]);

  // Initialiser/réinitialiser la taille sélectionnée quand le produit change
  useEffect(() => {
    if (uniqueVariantsBySize.length > 0) {
      const firstVariant = uniqueVariantsBySize[0];
      setSelectedSize(firstVariant.id);
    }
  }, [currentProduct?.id, uniqueVariantsBySize]);

  // Trouver la variante sélectionnée
  const selectedVariant = uniqueVariantsBySize.find(v => v.id === selectedSize) || uniqueVariantsBySize[0] || null;

  // Trouver l'image correspondant à la variante sélectionnée
  const getCurrentImage = () => {
    if (!currentProduct) return null;
    
    if (selectedVariant?.image?.src) {
      return selectedVariant.image;
    }
    
    return currentProduct.images[0] || null;
  };

  const currentImage = getCurrentImage();

  return (
    <div className="space-y-6">
      {/* Prix */}
      {selectedVariant && (
        <ProductPrice price={selectedVariant.formattedPrice} />
      )}

      {/* Sélecteur de couleurs */}
      {availableColors.length > 1 && (
        <div>
          <label className="block text-base mb-4 text-white font-medium tracking-wide">
            Couleur
          </label>
          <div className="flex flex-wrap gap-4">
            {availableColors.map((color) => {
              const isSelected = selectedColor === color;
              const colorHex = getColorHex(color);
              
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={isLoading}
                  className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full border-2 md:border-4 transition-all duration-300 ${
                    isSelected
                      ? 'border-white scale-125 shadow-[0_0_20px_rgba(255,255,255,0.6)]'
                      : 'border-[#666666] hover:border-white hover:scale-110'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{
                    backgroundColor: colorHex,
                    borderWidth: isSelected ? '3px' : undefined,
                  }}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white shadow-lg"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sélecteur de tailles */}
      {uniqueVariantsBySize.length > 1 && !isLoading && (
        <div>
          <label className="block text-base mb-4 text-white font-medium tracking-wide">
            Taille
          </label>
          <div className="flex flex-wrap gap-3">
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
                  className={`px-4 py-2.5 md:px-8 md:py-4 font-['IBM_Plex_Mono',monospace] text-sm md:text-base font-semibold border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105'
                      : variant.availableForSale
                      ? 'border-[#666666] bg-[#111111] text-white hover:border-white hover:bg-[#1a1a1a] hover:-translate-y-0.5'
                      : 'border-[#2a2a2a] bg-[#111111] text-[#666666] opacity-50 cursor-not-allowed'
                  }`}
                  style={{
                    borderWidth: isSelected ? '3px' : '2px',
                  }}
                >
                  {size.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
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
  );
}
