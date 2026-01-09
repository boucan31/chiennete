import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { notFound } from 'next/navigation';

// Note: Pour les articles, vous devrez créer une fonction getArticleByHandle
// similaire à getProductByHandle dans lib/shopify.ts
// Pour l'instant, cette page est un template de base

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ handle: string }> 
}) {
  const { handle } = await params;
  // TODO: Implémenter getArticleByHandle dans lib/shopify.ts
  // const article = await getArticleByHandle(params.handle);
  
  // if (!article) {
  //   notFound();
  // }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="max-w-[900px] mx-auto px-6 py-20">
        <article>
          <h1 className="font-['Dela_Gothic_One',sans-serif] text-4xl md:text-5xl mb-8">
            Article: {handle}
          </h1>
          
          <div className="prose prose-invert max-w-none text-[#999999]">
            <p>Contenu de l'article à venir...</p>
            <p>Vous devrez créer une fonction getArticleByHandle dans lib/shopify.ts pour récupérer les articles depuis Shopify.</p>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
}

