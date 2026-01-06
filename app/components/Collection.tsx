'use client';

import Image from 'next/image';

interface CollectionProps {
  productsByType: any;
  productTypes: string[];
}

export default function Collection({ productsByType, productTypes }: CollectionProps) {
  return (
    <section id="collection" className="py-32 px-12 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 font-['Dela_Gothic_One',sans-serif] text-[clamp(12rem,40vw,30rem)] text-white/5 pointer-events-none whitespace-nowrap">
        DROP 001
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="flex items-center gap-6 mb-16">
          <span className="font-['IBM_Plex_Mono',monospace] text-sm bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">02</span>
          <span className="w-20 h-px bg-gradient-to-r from-green-500 to-yellow-500"></span>
          <span className="text-[0.6rem] tracking-[0.3em] text-[#666666] uppercase">Collection</span>
        </div>

        <div className="flex justify-between items-end mb-16">
          <h2 className="font-['Dela_Gothic_One',sans-serif] text-[clamp(2.5rem,6vw,5rem)]">
            DROP <span className="text-transparent" style={{ WebkitTextStroke: '2px', WebkitTextStrokeImage: 'linear-gradient(to right, #00FF00, #FFFF00)' }}>001</span>
          </h2>
          <a href="#join" className="flex items-center gap-4 no-underline text-[0.65rem] tracking-[0.2em] uppercase transition-all hover:gap-6 bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
            TOUT VOIR
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {productTypes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#999999] mb-4">Aucun produit disponible pour le moment.</p>
            <p className="text-sm text-[#666666]">Configurez vos variables d&apos;environnement Shopify pour afficher les produits.</p>
          </div>
        ) : (
          <>
            {productTypes.map((type, typeIndex) => (
              <div key={type} className={typeIndex > 0 ? 'mt-32 pt-16 border-t border-white/10' : ''}>
                <h3 className="font-['Dela_Gothic_One',sans-serif] text-3xl mb-12 text-center">
                  {type}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsByType[type].map((product: any, index: number) => (
                    <div
                      key={product.id}
                      className="group relative aspect-[3/4] bg-[#111111] overflow-hidden transition-all duration-500 hover:-translate-y-2.5"
                      data-hover
                    >
                      <div className="absolute inset-0 border border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none" style={{ borderImage: 'linear-gradient(to right, #00FF00, #FFFF00) 1' }}></div>
                      
                      <span className="absolute top-5 left-5 font-['Dela_Gothic_One',sans-serif] text-2xl z-10 bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
                        {(index + 1).toString().padStart(3, '0')}
                      </span>

                      <div className="absolute inset-0 flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].src}
                            alt={product.title}
                            fill
                            className="object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-400"
                          />
                        ) : (
                          <span className="font-['Dela_Gothic_One',sans-serif] text-[10rem] text-white/5 group-hover:opacity-10 transition-all duration-400 bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
                            {product.title.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-green-500 to-yellow-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"></div>
                      <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-green-500 to-yellow-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-right"></div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 z-15">
                        <div className="text-[0.5rem] tracking-[0.2em] text-[#666666] uppercase mb-2">
                          {type}
                        </div>
                        <div className="font-['Unbounded',sans-serif] text-base font-semibold mb-4">
                          {product.title}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-['Dela_Gothic_One',sans-serif] text-xl bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
                            {product.variants && product.variants.length > 0
                              ? product.variants[0].formattedPrice
                              : 'Prix sur demande'}
                          </span>
                          <span className="text-[0.5rem] tracking-[0.15em] text-[#666666]">+ DÉTAILS</span>
                        </div>
                      </div>

                      <div className="absolute bottom-6 left-6 text-[0.5rem] tracking-[0.15em] text-[#666666] uppercase transition-opacity duration-300 group-hover:opacity-0">
                        {type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center mt-16">
              <p className="text-sm text-[#666666] tracking-[0.1em] mb-6">
                {productTypes.reduce((acc, type) => acc + productsByType[type].length, 0)} pièces exclusives — Quantités limitées
              </p>
              <a
                href="#join"
                className="inline-flex items-center gap-3 px-10 py-5 font-['Unbounded',sans-serif] font-bold text-[0.7rem] tracking-[0.15em] uppercase no-underline bg-gradient-to-r from-green-500 to-yellow-500 text-black transition-all duration-400 relative overflow-hidden group"
              >
                <span className="relative z-10">Être notifié du drop</span>
                <div className="absolute top-0 left-[-100%] w-full h-full bg-[#FF0033] transition-all duration-400 group-hover:left-0 z-0"></div>
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

