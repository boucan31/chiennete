import { getProducts } from '@/lib/shopify';

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="text-2xl font-bold tracking-tight text-black dark:text-white">
              LA CHIENNETÉ
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#collection" className="text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
                Collection
              </a>
            </nav>
            <button className="px-6 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-80 transition-opacity">
              Panier
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black dark:text-white mb-6">
              DROP 001
            </h1>
            <p className="text-xl sm:text-2xl text-black/60 dark:text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
              La première collection qui définit notre identité. 
              Des pièces essentielles, un design intemporel.
            </p>
            <a
              href="#collection"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
            >
              Découvrir la collection
            </a>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="collection" className="py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-black dark:text-white mb-4">
              La Collection
            </h2>
            <p className="text-lg text-black/60 dark:text-white/60 max-w-2xl mx-auto">
              Des pièces sélectionnées avec soin pour leur qualité et leur style
            </p>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-black/60 dark:text-white/60 mb-4">
                Aucun produit disponible pour le moment.
              </p>
              <p className="text-sm text-black/40 dark:text-white/40">
                Configurez vos variables d&apos;environnement Shopify pour afficher les produits.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="group bg-white dark:bg-black rounded-lg overflow-hidden border border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white transition-colors"
                >
                  <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].src}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">👕</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-black/60 dark:text-white/60 mb-4">
                      {product.vendor}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-black dark:text-white">
                        {product.variants && product.variants.length > 0
                          ? product.variants[0].price
                          : 'Prix sur demande'}
                      </span>
                      <a
                        href={product.onlineStoreUrl || `#`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-80 transition-opacity"
                      >
                        Voir
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="text-center text-sm text-black/60 dark:text-white/60">
            <p>© 2024 LA CHIENNETÉ. Tous droits réservés.</p>
            <p className="mt-2">Propulsé par Shopify & Railway</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

