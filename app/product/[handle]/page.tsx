import { getProductByHandle } from '@/lib/shopify';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import VariantAddToCartButton from '@/app/components/VariantAddToCartButton';
import ProductImageGallery from '@/app/components/ProductImageGallery';
import { notFound } from 'next/navigation';

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ handle: string }> 
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const firstVariant = product.variants[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <ProductImageGallery images={product.images} />

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <span className="font-['IBM_Plex_Mono',monospace] text-sm bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
                {product.vendor}
              </span>
            </div>
            
            <h1 className="font-['Dela_Gothic_One',sans-serif] text-4xl md:text-5xl mb-6">
              {product.title}
            </h1>

            {product.description && (
              <div 
                className="text-[#999999] mb-8 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {firstVariant && (
              <div className="mb-8">
                <p className="font-['Dela_Gothic_One',sans-serif] text-3xl bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
                  {firstVariant.formattedPrice}
                </p>
              </div>
            )}

            {product.variants.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm mb-3 text-[#999999]">Variante</label>
                <select 
                  id="variant-select"
                  className="w-full bg-[#111111] border border-[#2a2a2a] text-white p-3 focus:outline-none focus:border-green-500"
                  defaultValue={firstVariant.id}
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title} - {variant.formattedPrice}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <VariantAddToCartButton 
              variants={product.variants} 
              defaultVariantId={firstVariant.id}
            />

            {product.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#111111] text-sm text-[#999999] border border-[#2a2a2a]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

