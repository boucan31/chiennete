import { getProductByHandle } from '@/lib/shopify';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import ProductPageContent from '@/app/components/ProductPageContent';
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
          <ProductPageContent initialProduct={product} />

          {product.tags.length > 0 && (
            <div className="lg:col-span-2 mt-8 pt-8 border-t border-white/10">
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

      <Footer />
    </div>
  );
}

