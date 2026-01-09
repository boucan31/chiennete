'use client';

import { useState, useEffect } from 'react';
import AddToCartButton from './AddToCartButton';

interface Variant {
  id: string;
  title: string;
  formattedPrice: string;
}

interface VariantAddToCartButtonProps {
  variants: Variant[];
  defaultVariantId: string;
}

export default function VariantAddToCartButton({ 
  variants, 
  defaultVariantId 
}: VariantAddToCartButtonProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);

  useEffect(() => {
    // Écouter les changements du select de variante
    const select = document.getElementById('variant-select') as HTMLSelectElement;
    if (select) {
      const handleChange = () => {
        setSelectedVariantId(select.value);
      };
      select.addEventListener('change', handleChange);
      return () => select.removeEventListener('change', handleChange);
    }
  }, []);

  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];

  return (
    <AddToCartButton 
      variantId={selectedVariantId}
      productTitle={selectedVariant.title}
    />
  );
}

