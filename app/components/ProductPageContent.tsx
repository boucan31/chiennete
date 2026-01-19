'use client';

import { useState, useEffect } from 'react';
import ProductImageGallery from './ProductImageGallery';
import ProductColorSizeSelector from './ProductColorSizeSelector';

interface Product {
  id: string;
  title: string;
  handle: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
  variants: Array<{
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
  }>;
}

interface ProductPageContentProps {
  initialProduct: Product;
}

export default function ProductPageContent({ initialProduct }: ProductPageContentProps) {
  const [currentProduct, setCurrentProduct] = useState<Product>(initialProduct);
  const [productCache, setProductCache] = useState<Record<string, Product>>({
    [initialProduct.handle]: initialProduct
  });

  // Écouter les changements de produit depuis ProductColorSizeSelector
  useEffect(() => {
    const handleProductChange = (event: CustomEvent<Product>) => {
      const newProduct = event.detail;
      setCurrentProduct(newProduct);
      setProductCache(prev => ({
        ...prev,
        [newProduct.handle]: newProduct
      }));
    };

    window.addEventListener('productChanged' as any, handleProductChange as EventListener);
    return () => {
      window.removeEventListener('productChanged' as any, handleProductChange as EventListener);
    };
  }, []);

  return (
    <>
      {/* Images */}
      <ProductImageGallery images={currentProduct.images} />

      {/* Product Info */}
      <div className="flex flex-col justify-center">
        <div className="mb-6">
          <span className="font-['IBM_Plex_Mono',monospace] text-sm bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
            {currentProduct.vendor || 'La Chienneté'}
          </span>
        </div>
        
        <h1 className="font-['Dela_Gothic_One',sans-serif] text-4xl md:text-5xl mb-6">
          {currentProduct.title}
        </h1>

        {currentProduct.description && (
          <div 
            className="text-[#999999] mb-8 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: currentProduct.description }}
          />
        )}

        {currentProduct.variants.length > 0 && (
          <ProductColorSizeSelector 
            initialProduct={currentProduct}
          />
        )}
      </div>
    </>
  );
}
