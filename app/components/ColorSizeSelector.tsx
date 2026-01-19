'use client';

import { useState, useMemo, useEffect } from 'react';

interface Variant {
  id: string;
  title: string;
  formattedPrice: string;
  availableForSale?: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface ColorSizeSelectorProps {
  variants: Variant[];
  defaultVariantId: string;
  onVariantChange: (variantId: string) => void;
  productHandle?: string;
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
  'vert': '#00FF00',
  'green': '#00FF00',
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

// Fonction pour obtenir la couleur hex depuis le nom de couleur
const getColorHex = (colorName: string): string => {
  const normalized = colorName.toLowerCase().trim();
  return colorMap[normalized] || '#CCCCCC';
};

export default function ColorSizeSelector({ 
  variants, 
  defaultVariantId,
  onVariantChange,
  productHandle 
}: ColorSizeSelectorProps) {
  // Debug: afficher les variants et leurs options
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[ColorSizeSelector] All variants:', variants);
      variants.forEach((v, i) => {
        console.log(`[ColorSizeSelector] Variant ${i}:`, {
          id: v.id,
          title: v.title,
          selectedOptions: v.selectedOptions,
          available: v.availableForSale
        });
      });
    }
  }, [variants]);

  // Extraire les couleurs uniques depuis les variants
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    
    // D'abord, essayer de trouver toutes les options disponibles pour voir leurs noms
    const allOptionNames = new Set<string>();
    variants.forEach(variant => {
      variant.selectedOptions.forEach(opt => {
        allOptionNames.add(opt.name.toLowerCase().trim());
      });
    });
    
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[ColorSizeSelector] All option names found:', Array.from(allOptionNames));
    }
    
    variants.forEach(variant => {
      let colorFound = false;
      
      // Essayer plusieurs noms possibles pour la couleur
      const colorOption = variant.selectedOptions.find(opt => {
        const name = opt.name.toLowerCase().trim();
        return name === 'couleur' || 
               name === 'color' ||
               name === 'couleurs' ||
               name === 'colors' ||
               name === 'couleur / taille' ||
               name === 'color / size' ||
               name.includes('couleur') ||
               name.includes('color');
      });
      
      if (colorOption) {
        // Extraire la couleur de la valeur (peut être "Blanc / S" ou juste "Blanc")
        const colorValue = colorOption.value.split('/')[0].trim().toLowerCase();
        if (colorValue) {
          colors.add(colorValue);
          colorFound = true;
        }
      }
      
      // Si pas d'option couleur trouvée, essayer d'extraire depuis le titre
      if (!colorFound) {
        const titleParts = variant.title.split('/');
        if (titleParts.length > 0) {
          const possibleColor = titleParts[0].trim().toLowerCase();
          // Vérifier si ça ressemble à une couleur connue ou si c'est un mot court (probablement une couleur)
          const knownColors = ['blanc', 'white', 'noir', 'black', 'gris', 'grey', 'gray', 'vert', 'green', 'rouge', 'red', 'bleu', 'blue', 'jaune', 'yellow', 'rose', 'pink', 'violet', 'purple', 'orange', 'marron', 'brown'];
          if (colorMap[possibleColor] || knownColors.includes(possibleColor) || (possibleColor.length < 10 && !/\d/.test(possibleColor))) {
            colors.add(possibleColor);
            colorFound = true;
          }
        }
      }
      
      // Si toujours pas trouvé, essayer de chercher dans toutes les options
      if (!colorFound) {
        variant.selectedOptions.forEach(opt => {
          const value = opt.value.toLowerCase().trim();
          // Si la valeur ressemble à une couleur (pas de chiffres, court)
          if (value.length < 15 && !/\d/.test(value) && !value.includes('taille') && !value.includes('size')) {
            const knownColors = ['blanc', 'white', 'noir', 'black', 'gris', 'grey', 'gray', 'vert', 'green', 'rouge', 'red', 'bleu', 'blue', 'jaune', 'yellow', 'rose', 'pink', 'violet', 'purple', 'orange', 'marron', 'brown'];
            if (knownColors.includes(value) || colorMap[value]) {
              colors.add(value);
            }
          }
        });
      }
      
      // Si toujours pas trouvé et qu'on a un handle de produit, essayer d'extraire depuis le handle
      if (!colorFound && productHandle) {
        const handleParts = productHandle.toLowerCase().split('-');
        handleParts.forEach(part => {
          const knownColors = ['blanc', 'white', 'noir', 'black', 'gris', 'grey', 'gray', 'vert', 'green', 'rouge', 'red', 'bleu', 'blue', 'jaune', 'yellow', 'rose', 'pink', 'violet', 'purple', 'orange', 'marron', 'brown'];
          if (knownColors.includes(part) || colorMap[part]) {
            colors.add(part);
          }
        });
      }
    });
    
    const colorsArray = Array.from(colors);
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[ColorSizeSelector] Detected colors:', colorsArray);
    }
    
    return colorsArray;
  }, [variants]);

  // Trouver la couleur du variant par défaut
  const defaultVariant = variants.find(v => v.id === defaultVariantId) || variants[0];
  const defaultColorOption = defaultVariant?.selectedOptions.find(opt => 
    opt.name.toLowerCase() === 'couleur' || 
    opt.name.toLowerCase() === 'color' ||
    opt.name.toLowerCase() === 'couleurs'
  );
  const defaultColor = defaultColorOption?.value.toLowerCase() || availableColors[0] || '';

  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Filtrer les variants par couleur sélectionnée
  const variantsByColor = useMemo(() => {
    if (availableColors.length <= 1) {
      // Si une seule couleur ou aucune, retourner tous les variants
      return variants;
    }
    
    return variants.filter(variant => {
      const colorOption = variant.selectedOptions.find(opt => {
        const name = opt.name.toLowerCase().trim();
        return name === 'couleur' || 
               name === 'color' ||
               name === 'couleurs' ||
               name === 'colors' ||
               name === 'couleur / taille' ||
               name === 'color / size';
      });
      
      if (colorOption) {
        const colorValue = colorOption.value.split('/')[0].trim().toLowerCase();
        return colorValue === selectedColor;
      } else {
        // Essayer d'extraire depuis le titre
        const titleParts = variant.title.split('/');
        if (titleParts.length > 0) {
          const possibleColor = titleParts[0].trim().toLowerCase();
          return possibleColor === selectedColor;
        }
      }
      return false;
    });
  }, [variants, selectedColor, availableColors.length]);

  // Extraire les tailles uniques pour la couleur sélectionnée
  const availableSizes = useMemo(() => {
    const sizes = new Map<string, Variant>();
    
    variantsByColor.forEach(variant => {
      // Essayer plusieurs noms possibles pour la taille
      const sizeOption = variant.selectedOptions.find(opt => {
        const name = opt.name.toLowerCase().trim();
        return name === 'taille' || 
               name === 'size' ||
               name === 'tailles' ||
               name === 'sizes' ||
               name === 'couleur / taille' ||
               name === 'color / size';
      });
      
      let size = sizeOption?.value;
      
      // Si pas trouvé dans les options, essayer d'extraire depuis la valeur de l'option combinée
      if (!size && sizeOption) {
        const parts = sizeOption.value.split('/');
        size = parts.length > 1 ? parts[parts.length - 1].trim() : parts[0].trim();
      }
      
      // Si toujours pas trouvé, essayer depuis le titre
      if (!size) {
        const titleParts = variant.title.split('/');
        size = titleParts.length > 1 ? titleParts[titleParts.length - 1].trim() : variant.title;
      }
      
      const normalizedSize = size.toUpperCase().trim();
      
      if (!sizes.has(normalizedSize)) {
        sizes.set(normalizedSize, variant);
      }
    });
    
    return Array.from(sizes.entries()).map(([size, variant]) => ({
      size,
      variant
    }));
  }, [variantsByColor]);

  // Initialiser la taille sélectionnée
  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      const firstSize = availableSizes[0];
      setSelectedSize(firstSize.variant.id);
      onVariantChange(firstSize.variant.id);
    }
  }, [availableSizes, selectedSize, onVariantChange]);

  // Mettre à jour le variant sélectionné quand la taille change
  useEffect(() => {
    if (selectedSize) {
      onVariantChange(selectedSize);
    }
  }, [selectedSize, onVariantChange]);

  // Réinitialiser la taille quand la couleur change
  useEffect(() => {
    if (availableSizes.length > 0) {
      const firstSize = availableSizes[0];
      setSelectedSize(firstSize.variant.id);
      onVariantChange(firstSize.variant.id);
    }
  }, [selectedColor]);

  const selectedVariant = variants.find(v => v.id === selectedSize) || variants[0];

  // Debug: afficher les couleurs et tailles détectées
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[ColorSizeSelector] Available colors:', availableColors);
      console.log('[ColorSizeSelector] Available sizes:', availableSizes);
      console.log('[ColorSizeSelector] Selected color:', selectedColor);
      console.log('[ColorSizeSelector] Selected size:', selectedSize);
    }
  }, [availableColors, availableSizes, selectedColor, selectedSize]);

  return (
    <div className="space-y-6">
      {/* Sélecteur de couleurs */}
      {availableColors.length > 0 && (
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
                  className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full border-2 md:border-4 transition-all duration-300 ${
                    isSelected
                      ? 'border-white scale-125 shadow-[0_0_20px_rgba(255,255,255,0.6)]'
                      : 'border-[#666666] hover:border-white hover:scale-110'
                  }`}
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
      
      {/* Message de debug si aucune couleur trouvée */}
      {availableColors.length === 0 && typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && (
        <div className="text-yellow-500 text-sm">
          Aucune couleur détectée. Options disponibles: {JSON.stringify(variants[0]?.selectedOptions || [])}
        </div>
      )}

      {/* Sélecteur de tailles */}
      {availableSizes.length > 0 && (
        <div>
          <label className="block text-base mb-4 text-white font-medium tracking-wide">
            Taille
          </label>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map(({ size, variant }) => {
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
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
