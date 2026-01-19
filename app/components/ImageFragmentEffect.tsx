'use client';

import { useEffect, useState, useRef } from 'react';

export default function ImageFragmentEffect() {
  const [fragments, setFragments] = useState(1); // Nombre de divisions (1 = pas de division, 2 = 2x2, 4 = 4x4, etc.)
  const [fragmentProgress, setFragmentProgress] = useState(0);
  const [shouldHideOriginal, setShouldHideOriginal] = useState(false);
  const lastScrollY = useRef(0);
  const scrollDownDistance = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const dropSection = document.getElementById('drop');
      if (!dropSection) return;

      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY < lastScrollY.current ? 'up' : 'down';
      const dropTop = dropSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      // L'effet se déclenche quand on scroll vers le bas ET que la section drop est visible
      if (scrollDirection === 'down' && dropTop < windowHeight && dropTop > -windowHeight) {
        // Accumuler la distance de scroll vers le bas
        const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
        scrollDownDistance.current += scrollDelta;
        
        // L'effet commence quand on scroll vers le bas
        // Transition complète sur une distance de scroll de 500px vers le bas
        const maxScrollDistance = 500;
        const progress = Math.min(1, scrollDownDistance.current / maxScrollDistance);
        
        setFragmentProgress(progress);
        
        // Déterminer le nombre de fragments selon le progrès
        // 0-0.2: 2x2 (4 fragments)
        // 0.2-0.4: 4x4 (16 fragments)
        // 0.4-0.6: 8x8 (64 fragments)
        // 0.6-0.8: 16x16 (256 fragments)
        // 0.8-1: 32x32 (1024 fragments)
        if (progress > 0) {
          if (progress < 0.2) {
            setFragments(2);
          } else if (progress < 0.4) {
            setFragments(4);
          } else if (progress < 0.6) {
            setFragments(8);
          } else if (progress < 0.8) {
            setFragments(16);
          } else {
            setFragments(32);
          }
          
          setShouldHideOriginal(progress > 0.1);
        }
      } else if (scrollDirection === 'up') {
        // Réinitialiser progressivement quand on scroll vers le haut
        const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
        scrollDownDistance.current = Math.max(0, scrollDownDistance.current - scrollDelta * 1.5);
        
        if (scrollDownDistance.current <= 0) {
          setFragments(1);
          setFragmentProgress(0);
          setShouldHideOriginal(false);
        } else {
          const maxScrollDistance = 500;
          const progress = Math.min(1, scrollDownDistance.current / maxScrollDistance);
          setFragmentProgress(progress);
          
          if (progress < 0.2) {
            setFragments(2);
          } else if (progress < 0.4) {
            setFragments(4);
          } else if (progress < 0.6) {
            setFragments(8);
          } else if (progress < 0.8) {
            setFragments(16);
          } else {
            setFragments(32);
          }
          
          setShouldHideOriginal(progress > 0.1);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Masquer l'image originale quand les fragments apparaissent
  useEffect(() => {
    const bgElement = document.getElementById('background-image');
    if (bgElement) {
      bgElement.style.opacity = shouldHideOriginal ? '0' : '0.8';
    }
  }, [shouldHideOriginal]);

  if (fragments === 1) return null;

  const gridSize = fragments;
  const fragmentWidth = 100 / gridSize;
  const fragmentHeight = 100 / gridSize;
  const maxOffset = 300; // Distance maximale de séparation

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        
        // Calculer la position de départ
        const startX = col * fragmentWidth;
        const startY = row * fragmentHeight;
        
        // Calculer l'offset de séparation (direction aléatoire mais cohérente)
        const seed = index * 7; // Pour avoir des valeurs cohérentes
        const angle = (seed % 360) * (Math.PI / 180);
        const distance = fragmentProgress * maxOffset * (0.6 + (seed % 100) / 250);
        
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        
        // Rotation aléatoire plus prononcée
        const rotation = fragmentProgress * (seed % 90 - 45); // Entre -45 et 45 degrés
        
        // Opacité qui diminue avec la distance mais reste visible plus longtemps
        const opacity = Math.max(0.3, 1 - fragmentProgress * 0.4);

        return (
          <div
            key={index}
            className="absolute bg-cover bg-center bg-no-repeat"
            style={{
              width: `${fragmentWidth}%`,
              height: `${fragmentHeight}%`,
              left: `${startX}%`,
              top: `${startY}%`,
              backgroundImage: 'url(/images/fondecran.jpeg)',
              backgroundPosition: `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`,
              backgroundSize: `${gridSize * 100}%`,
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`,
              opacity: opacity,
              transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
              willChange: 'transform, opacity',
            }}
          />
        );
      })}
    </div>
  );
}
