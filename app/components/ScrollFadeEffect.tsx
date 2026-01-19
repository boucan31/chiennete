'use client';

import { useEffect, useState } from 'react';

interface ScrollFadeEffectProps {
  children: React.ReactNode;
}

export default function ScrollFadeEffect({ children }: ScrollFadeEffectProps) {
  const [opacity, setOpacity] = useState(1);
  const [transform, setTransform] = useState('translateY(0) scale(1)');
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const dropSection = document.getElementById('drop');
      
      if (!dropSection) return;

      const dropTop = dropSection.offsetTop;
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Zone de transition : commence quand on approche de drop
      const transitionStart = dropTop - windowHeight * 1.5;
      const transitionEnd = dropTop - windowHeight * 0.2;
      const transitionRange = transitionEnd - transitionStart;

      if (scrollPosition >= transitionStart) {
        // Calculer le progrès (0 à 1)
        const progress = Math.min(
          1,
          (scrollPosition - transitionStart) / transitionRange
        );
        
        // Opacité qui diminue progressivement avec une courbe d'easing
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Easing cubic
        const newOpacity = 1 - easedProgress;
        setOpacity(Math.max(0, newOpacity));
        
        // Transformation : translation vers le haut, scale down, et rotation subtile
        const scale = 1 - easedProgress * 0.15; // Réduit jusqu'à 85%
        const translateY = -easedProgress * 80; // Remonte jusqu'à 80px
        const rotate = easedProgress * 2; // Rotation légère jusqu'à 2deg
        setTransform(`translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`);
        
        // Effet de blur qui augmente progressivement
        setBlur(easedProgress * 10); // Blur jusqu'à 10px
        
        // Diminution de la luminosité
        setBrightness(1 - easedProgress * 0.3); // Diminue jusqu'à 70%
      } else {
        setOpacity(1);
        setTransform('translateY(0) scale(1) rotate(0deg)');
        setBlur(0);
        setBrightness(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Appel initial

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        opacity: opacity,
        transform: transform,
        filter: `blur(${blur}px) brightness(${brightness})`,
        transition: 'opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), filter 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'opacity, transform, filter',
        pointerEvents: opacity < 0.1 ? 'none' : 'auto',
      }}
    >
      {children}
    </div>
  );
}
