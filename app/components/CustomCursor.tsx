'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Détecter si on est sur mobile
    const checkMobile = () => {
      // Vérifier la largeur de l'écran et la présence d'un pointeur tactile
      const isMobileDevice = 
        window.innerWidth <= 768 || 
        ('ontouchstart' in window) || 
        (navigator.maxTouchPoints > 0) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setIsMobile(isMobileDevice);
      return isMobileDevice;
    };

    // Vérifier immédiatement si on est sur mobile
    const isMobileDevice = checkMobile();
    
    // Si on est sur mobile, ne pas initialiser le curseur personnalisé
    if (isMobileDevice) {
      return;
    }

    // Réécouter les changements de taille de fenêtre
    const handleResize = () => {
      const mobile = checkMobile();
      // Si on passe en mode mobile, on ne fait rien de plus
      // Le cleanup se chargera de retirer les event listeners
    };
    
    window.addEventListener('resize', handleResize);

    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    document.addEventListener('mousemove', updateCursor);

    const hoverElements = document.querySelectorAll('a, button, [data-hover]');
    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', updateCursor);
      hoverElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Ne pas afficher le curseur personnalisé sur mobile
  if (isMobile) {
    return null;
  }

  return (
    <>
      <div
        className={`fixed pointer-events-none z-[99999] transition-all duration-150 mix-blend-difference ${
          isActive ? 'w-[60px] h-[60px] border-red-500 rotate-45 rounded-none' : 'w-5 h-5 rounded-full'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) ${isActive ? 'rotate(45deg)' : ''}`,
          border: isActive ? '2px solid #FF0033' : '2px solid',
          borderImage: isActive ? 'none' : 'linear-gradient(to right, #00FF00, #FFFF00) 1',
        }}
      />
      <div
        className="fixed pointer-events-none z-[99999] w-1.5 h-1.5 rounded-full transition-transform duration-50 bg-gradient-to-r from-green-500 to-yellow-500"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
}

