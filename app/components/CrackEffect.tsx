'use client';

import { useEffect, useState } from 'react';

export default function CrackEffect() {
  const [crackProgress, setCrackProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const dropSection = document.getElementById('drop');
      if (!dropSection) return;

      const dropTop = dropSection.offsetTop;
      const scrollPosition = window.scrollY + window.innerHeight;
      const triggerPoint = dropTop - window.innerHeight * 0.3;

      if (scrollPosition >= triggerPoint) {
        // Calculer le progrès du craquellement (0 à 100)
        const progress = Math.min(
          100,
          ((scrollPosition - triggerPoint) / (window.innerHeight * 0.4)) * 100
        );
        setCrackProgress(progress);
      } else {
        setCrackProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Appel initial

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (crackProgress === 0) return null;

  const opacity = Math.min(1, crackProgress / 100);
  const crackIntensity = crackProgress / 100;

  return (
    <div 
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{
        opacity: opacity,
        transition: 'opacity 0.1s ease-out',
      }}
    >
      {/* Effet de craquellement avec SVG */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        style={{ 
          mixBlendMode: 'multiply',
          filter: `contrast(${1 + crackIntensity * 0.5}) brightness(${1 - crackIntensity * 0.2})`,
        }}
      >
        <defs>
          <filter id="crackFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency={`${0.01 + crackIntensity * 0.02}`}
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale={crackIntensity * 20}
            />
          </filter>
          <pattern id="crackPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path
              d={`M 50 ${20 + crackIntensity * 10} 
                  Q ${45 + crackIntensity * 5} ${30 + crackIntensity * 15} 
                  ${40 + crackIntensity * 8} ${40 + crackIntensity * 20}
                  Q ${35 + crackIntensity * 10} ${50 + crackIntensity * 25} 
                  ${30 + crackIntensity * 12} ${60 + crackIntensity * 30}
                  Q ${25 + crackIntensity * 15} ${70 + crackIntensity * 35} 
                  ${20 + crackIntensity * 18} ${80 + crackIntensity * 40}`}
              stroke="rgba(0, 0, 0, 0.8)"
              strokeWidth={2 + crackIntensity * 3}
              fill="none"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        
        {/* Fissures principales */}
        <g opacity={opacity}>
          {/* Fissure centrale principale */}
          <path
            d={`M 50% ${20 + crackIntensity * 15}% 
                Q ${45 + crackIntensity * 3}% ${30 + crackIntensity * 20}% 
                ${40 + crackIntensity * 5}% ${40 + crackIntensity * 25}%
                Q ${35 + crackIntensity * 7}% ${50 + crackIntensity * 30}% 
                ${30 + crackIntensity * 9}% ${60 + crackIntensity * 35}%
                Q ${25 + crackIntensity * 11}% ${70 + crackIntensity * 40}% 
                ${20 + crackIntensity * 13}% ${80 + crackIntensity * 45}%`}
            stroke="rgba(0, 0, 0, 0.9)"
            strokeWidth={2 + crackIntensity * 4}
            fill="none"
            strokeLinecap="round"
            filter="url(#crackFilter)"
          />
          
          {/* Fissures secondaires */}
          <path
            d={`M ${60 + crackIntensity * 5}% ${30 + crackIntensity * 10}% 
                Q ${65 + crackIntensity * 7}% ${40 + crackIntensity * 15}% 
                ${70 + crackIntensity * 9}% ${50 + crackIntensity * 20}%`}
            stroke="rgba(0, 0, 0, 0.7)"
            strokeWidth={1.5 + crackIntensity * 2.5}
            fill="none"
            strokeLinecap="round"
          />
          
          <path
            d={`M ${30 - crackIntensity * 3}% ${50 + crackIntensity * 12}% 
                Q ${25 - crackIntensity * 5}% ${60 + crackIntensity * 18}% 
                ${20 - crackIntensity * 7}% ${70 + crackIntensity * 24}%`}
            stroke="rgba(0, 0, 0, 0.7)"
            strokeWidth={1.5 + crackIntensity * 2.5}
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Petites fissures */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const startX = 50 + Math.cos(angle) * (10 + crackIntensity * 15);
            const startY = 50 + Math.sin(angle) * (10 + crackIntensity * 15);
            const endX = startX + Math.cos(angle) * (5 + crackIntensity * 10);
            const endY = startY + Math.sin(angle) * (5 + crackIntensity * 10);
            
            return (
              <path
                key={i}
                d={`M ${startX}% ${startY}% L ${endX}% ${endY}%`}
                stroke="rgba(0, 0, 0, 0.6)"
                strokeWidth={1 + crackIntensity * 1.5}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      </svg>

      {/* Overlay de texture de craquellement */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at ${30 + crackIntensity * 10}% ${40 + crackIntensity * 15}%, 
              transparent ${crackIntensity * 20}%, 
              rgba(0, 0, 0, ${0.1 + crackIntensity * 0.3}) ${crackIntensity * 25}%),
            radial-gradient(circle at ${70 - crackIntensity * 10}% ${60 - crackIntensity * 15}%, 
              transparent ${crackIntensity * 20}%, 
              rgba(0, 0, 0, ${0.1 + crackIntensity * 0.3}) ${crackIntensity * 25}%)
          `,
          opacity: opacity * 0.8,
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
}
