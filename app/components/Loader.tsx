'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// Liste des images à afficher dans le splash screen
const splashImages = [
  '/images/PHOTO-2025-12-28-15-29-41.jpg',
  '/images/PHOTO-2025-12-28-15-29-41 2.jpg',
  '/images/PHOTO-2025-12-28-15-29-41 3.jpg',
  '/images/PHOTO-2025-12-28-15-29-42.jpg',
  '/images/PHOTO-2025-12-28-15-29-42 2.jpg',
  '/images/PHOTO-2025-12-28-15-29-42 3.jpg',
  '/images/PHOTO-2025-12-28-15-29-42 4.jpg',
];

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const pathname = usePathname();

  // Ne pas afficher le loader sur les pages produits/articles
  const shouldHideLoader = pathname?.startsWith('/product') || pathname?.startsWith('/article');

  useEffect(() => {
    // Si on est sur une page produit/article, masquer immédiatement
    if (shouldHideLoader) {
      setIsHidden(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 3;
        
        // Changer l'image en même temps que le décompte
        // Calculer l'index de l'image basé sur le progrès pour synchroniser avec les numéros
        const progressPercentage = Math.min(newProgress, 100);
        const imageIndex = Math.floor((progressPercentage / 100) * splashImages.length);
        const clampedIndex = Math.min(imageIndex, splashImages.length - 1);
        setCurrentImageIndex(clampedIndex);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsHidden(true);
          }, 300);
          return 100;
        }
        return newProgress;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [shouldHideLoader]);

  if (isHidden || shouldHideLoader) return null;

  return (
    <div
      className={`fixed inset-0 z-[100000] bg-black flex items-center justify-center flex-col transition-all duration-800 ${
        isHidden ? 'pointer-events-none' : ''
      }`}
      style={{
        clipPath: isHidden ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
      }}
    >
      {/* Images en arrière-plan qui changent en même temps que le décompte */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {splashImages.map((imagePath, index) => (
          <div
            key={imagePath}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentImageIndex ? 'opacity-20' : 'opacity-0'
            }`}
          >
            <Image
              src={imagePath}
              alt={`Splash image ${index + 1}`}
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Animations décoratives */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[300px] h-[300px] top-[20%] left-[20%] border animate-spin opacity-10" style={{ animationDuration: '20s', borderImage: 'linear-gradient(to right, #00FF00, #FFFF00) 1' }}></div>
        <div className="absolute w-[400px] h-[400px] bottom-[20%] right-[20%] border border-[#FF0033]/5 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
      </div>

      {/* Contenu au-dessus des images */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="font-['Unbounded',sans-serif] text-[clamp(5rem,15vw,14rem)] font-black leading-none tracking-tight bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
          {Math.floor(progress).toString().padStart(3, '0')}
        </div>
        <div className="font-['Dela_Gothic_One',sans-serif] text-2xl tracking-[0.3em] text-white/30 mt-8">
          LA CHIENNETÉ
        </div>
        <div className="w-[200px] h-[3px] bg-[#1a1a1a] mt-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

