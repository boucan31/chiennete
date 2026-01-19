'use client';

import { useState } from 'react';
import ColorSizeSelector from './ColorSizeSelector';
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
}

interface ProductVariantSelectorProps {
  variants: Variant[];
  defaultVariantId: string;
  productHandle?: string;
}

export default function ProductVariantSelector({ 
  variants, 
  defaultVariantId,
  productHandle 
}: ProductVariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);

  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];
  const isAvailable = selectedVariant?.availableForSale !== false;

  return (
    <div className="space-y-6">
      {/* Prix */}
      {selectedVariant && (
        <ProductPrice price={selectedVariant.formattedPrice} />
      )}

      <ColorSizeSelector
        variants={variants}
        defaultVariantId={defaultVariantId}
        onVariantChange={setSelectedVariantId}
        productHandle={productHandle}
      />

      <AddToCartButton 
        variantId={selectedVariantId}
        productTitle={selectedVariant.title}
        available={isAvailable}
      />
    </div>
  );
}
