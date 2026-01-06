import { getProducts } from '@/lib/shopify';
import Marquee from './components/Marquee';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Manifeste from './components/Manifeste';
import Collection from './components/Collection';
import Join from './components/Join';
import Footer from './components/Footer';
import ImageCarousel from './components/ImageCarousel';

export default async function Home() {
  const products = await getProducts();

  // Group products by type/category
  const productsByType = products.reduce((acc: any, product: any) => {
    const type = product.productType || 'Autres';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(product);
    return acc;
  }, {});

  const productTypes = Object.keys(productsByType);

  return (
    <div className="min-h-screen bg-black text-white relative">
      <ImageCarousel />
      <Navigation />
      
      <Hero />
      
      {/* Double Marquee Section */}
      <section className="py-20 bg-[#111111] overflow-hidden">
        <Marquee speed={30} className="mb-4">
          <span className="font-['Dela_Gothic_One',sans-serif] text-[clamp(4rem,10vw,8rem)] text-white/5 whitespace-nowrap px-8">
            LA CHIENNETÉ — STREETWEAR BRUTAL — PARIS 2025 —
          </span>
        </Marquee>
        <Marquee speed={40} direction="right" className="mt-4">
          <span className="font-['Dela_Gothic_One',sans-serif] text-[clamp(4rem,10vw,8rem)] whitespace-nowrap px-8" style={{
            WebkitTextStroke: '1px',
            stroke: 'url(#greenYellowGradientStroke)',
            color: 'transparent',
          }}>
            DROP 001 — NO RULES — NO LIMITS — MADE IN FRANCE —
            <svg className="absolute w-0 h-0">
              <linearGradient id="greenYellowGradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0, 255, 0, 0.15)" />
                <stop offset="100%" stopColor="rgba(255, 255, 0, 0.15)" />
              </linearGradient>
            </svg>
          </span>
        </Marquee>
      </section>

      <Manifeste />

      <Collection productsByType={productsByType} productTypes={productTypes} />

      <Join />

      <Footer />
    </div>
  );
}
