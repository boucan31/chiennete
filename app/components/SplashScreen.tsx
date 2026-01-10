'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  '/images/PHOTO-2025-12-28-15-29-41 2.jpg',
  '/images/PHOTO-2025-12-28-15-29-41 3.jpg',
  '/images/PHOTO-2025-12-28-15-29-41.jpg',
  '/images/PHOTO-2025-12-28-15-29-42 2.jpg',
  '/images/PHOTO-2025-12-28-15-29-42 3.jpg',
  '/images/PHOTO-2025-12-28-15-29-42 4.jpg',
  '/images/PHOTO-2025-12-28-15-29-42.jpg',
];

const SPLASH_SEEN_KEY = 'la_chiennete_splash_seen';

export default function SplashScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Détecter si c'est un retour arrière ou si le splash a déjà été vu dans cette session
    const checkBackNavigation = () => {
      if (typeof window === 'undefined') return true;

      // Vérifier si le splash a déjà été vu dans cette session
      // Cette vérification fonctionne pour les retours arrière car sessionStorage persiste
      if (sessionStorage.getItem(SPLASH_SEEN_KEY) === 'true') {
        return true;
      }

      // Détecter les retours arrière via Navigation Timing API (chargement initial uniquement)
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          // Type 'back_forward' indique une navigation arrière/avant (full page reload)
          if (navigation.type === 'back_forward') {
            // Marquer comme vu pour éviter de le réafficher
            sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
            return true;
          }
        }
      } catch (e) {
        // Fallback pour les navigateurs qui ne supportent pas Navigation Timing API
        // Vérifier via performance.navigation (legacy API)
        try {
          const perfNav = (performance as any).navigation;
          if (perfNav && (perfNav.type === 2 || perfNav.type === 'back_forward')) {
            // Type 2 = back_forward
            sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
            return true;
          }
        } catch (err) {
          // Ignorer les erreurs
        }
      }

      return false;
    };

    // Si c'est un retour arrière ou déjà vu, masquer immédiatement
    if (checkBackNavigation()) {
      setIsVisible(false);
      return;
    }

    // Marquer que le splash a été vu dans cette session
    // Cela empêchera l'affichage lors des retours arrière (client-side navigation)
    sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');

    // Change image every 200ms (much faster)
    const imageInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 200);

    // Hide splash screen after 1.5 seconds (after showing all images quickly)
    const hideTimeout = setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 300); // Faster fade out animation
    }, 1500);

    return () => {
      clearInterval(imageInterval);
      clearTimeout(hideTimeout);
    };
  }, []);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-500 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute transition-opacity duration-300 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={src}
              alt={`Splash image ${index + 1}`}
              fill
              className="object-cover rounded-lg"
              priority
              quality={90}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

