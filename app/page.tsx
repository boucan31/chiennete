import { getSweaterByColor, getTShirtByColor, getBeanieByColor } from '@/lib/shopify';
import Marquee from './components/Marquee';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Manifeste from './components/Manifeste';
import Join from './components/Join';
import Footer from './components/Footer';
import FeaturedSweatshirt from './components/FeaturedSweatshirt';
import FeaturedTShirt from './components/FeaturedTShirt';
import FeaturedBeanie from './components/FeaturedBeanie';

export default async function Home() {
  // Charger le produit blanc par défaut
  const whiteSweater = await getSweaterByColor('blanc');
  const whiteTShirt = await getTShirtByColor('blanc');
  const whiteBeanie = await getBeanieByColor('blanc');

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background image */}
      <div className="fixed inset-0 z-0">
        <div 
          id="background-image"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 transition-opacity duration-300"
          style={{
            backgroundImage: 'url(/images/fondecran.jpeg)',
          }}
        ></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <Navigation />
        
      <Hero />

      {/* Drop Section */}
      <section id="drop" className="relative bg-transparent z-10">
        {/* Featured Sweatshirt Section */}
        <FeaturedSweatshirt initialProduct={whiteSweater} />

        {/* Featured T-Shirt Section */}
        <FeaturedTShirt initialProduct={whiteTShirt} />

        {/* Featured Beanie Section */}
        <FeaturedBeanie initialProduct={whiteBeanie} />
      </section>

      <Manifeste />

      <Join />

      <Footer />
    </div>
  );
}
