import { getProductByHandle } from '@/lib/shopify';
import Image from 'next/image';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
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

  const mainImage = product.images[0]?.src || '';
  const firstVariant = product.variants[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-4">
            {mainImage && (
              <div className="aspect-square relative bg-[#111111] overflow-hidden">
                <Image
                  src={mainImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square relative bg-[#111111] overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

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
                <select className="w-full bg-[#111111] border border-[#2a2a2a] text-white p-3 focus:outline-none focus:border-green-500">
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title} - {variant.formattedPrice}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-black font-['Dela_Gothic_One',sans-serif] py-4 px-8 text-lg uppercase tracking-wider hover:opacity-90 transition-opacity">
              Ajouter au panier
            </button>

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

