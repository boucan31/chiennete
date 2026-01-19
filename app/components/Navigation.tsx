'use client';

import { useState, useEffect } from 'react';
import CartSidebar from './CartSidebar';

export default function Navigation() {
  const [time, setTime] = useState('00:00');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Écouter l'événement pour ouvrir le panier automatiquement après ajout d'un article
  useEffect(() => {
    const handleOpenCart = () => {
      setIsCartOpen(true);
    };

    window.addEventListener('openCart', handleOpenCart);
    return () => {
      window.removeEventListener('openCart', handleOpenCart);
    };
  }, []);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full px-12 py-6 flex justify-between items-center z-[1000] md:mix-blend-difference">
      <a href="/" className="font-['Dela_Gothic_One',sans-serif] text-2xl tracking-[0.15em] text-white no-underline relative">
        La Chienneté
        <span className="absolute top-0 -right-6 text-xs">®</span>
      </a>
      
      <div className="hidden md:flex items-center gap-4">
        <span className="text-sm tracking-[0.2em] text-white font-medium">Saint-Jacques</span>
        <span className="font-['IBM_Plex_Mono',monospace] text-sm bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">{time}</span>
      </div>

      <ul className="hidden md:flex gap-12 list-none">
        <li>
          <a href="#manifeste" className="text-white no-underline text-[0.65rem] tracking-[0.2em] uppercase flex items-center gap-3 transition-all hover:bg-gradient-to-r hover:from-green-500 hover:to-yellow-500 hover:bg-clip-text hover:text-transparent">
            <span className="text-[#666666] text-[0.6rem]">01</span>
            <span>Manifeste</span>
          </a>
        </li>
        <li>
          <a href="#drop" className="text-white no-underline text-[0.65rem] tracking-[0.2em] uppercase flex items-center gap-3 transition-all hover:bg-gradient-to-r hover:from-green-500 hover:to-yellow-500 hover:bg-clip-text hover:text-transparent">
            <span className="text-[#666666] text-[0.6rem]">02</span>
            <span>Drop 001</span>
          </a>
        </li>
        <li>
          <a href="#join" className="text-white no-underline text-[0.65rem] tracking-[0.2em] uppercase flex items-center gap-3 transition-all hover:bg-gradient-to-r hover:from-green-500 hover:to-yellow-500 hover:bg-clip-text hover:text-transparent">
            <span className="text-[#666666] text-[0.6rem]">03</span>
            <span>Rejoindre</span>
          </a>
        </li>
        <li>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-white bg-transparent border-none cursor-pointer text-[0.65rem] tracking-[0.2em] uppercase flex items-center gap-3 transition-all hover:bg-gradient-to-r hover:from-green-500 hover:to-yellow-500 hover:bg-clip-text hover:text-transparent p-0 font-inherit"
          >
            <span className="text-[#666666] text-[0.6rem]">04</span>
            <span>Panier</span>
          </button>
        </li>
      </ul>

      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2.5 z-[1001] relative"
        aria-label="Toggle menu"
      >
        <span className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Menu mobile */}
      <div 
        className={`fixed top-0 left-0 w-full h-screen bg-black z-[1000] transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-12">
          <ul className="flex flex-col gap-8 list-none">
            <li>
              <a 
                href="#manifeste" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white no-underline text-lg tracking-[0.2em] uppercase flex items-center gap-4 transition-all"
              >
                <span className="text-[#666666] text-sm">01</span>
                <span>Manifeste</span>
              </a>
            </li>
            <li>
              <a 
                href="#drop" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white no-underline text-lg tracking-[0.2em] uppercase flex items-center gap-4 transition-all"
              >
                <span className="text-[#666666] text-sm">02</span>
                <span>Drop 001</span>
              </a>
            </li>
            <li>
              <a 
                href="#join" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white no-underline text-lg tracking-[0.2em] uppercase flex items-center gap-4 transition-all"
              >
                <span className="text-[#666666] text-sm">03</span>
                <span>Rejoindre</span>
              </a>
            </li>
            <li>
              <button
                onClick={() => {
                  setIsCartOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-white bg-transparent border-none cursor-pointer text-lg tracking-[0.2em] uppercase flex items-center gap-4 transition-all p-0 font-inherit text-left"
              >
                <span className="text-[#666666] text-sm">04</span>
                <span>Panier</span>
              </button>
            </li>
          </ul>
          
          <div className="mt-auto pb-12 flex flex-col gap-4">
            <span className="text-sm tracking-[0.2em] text-white font-medium">Saint-Jacques</span>
            <span className="font-['IBM_Plex_Mono',monospace] text-sm bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">{time}</span>
          </div>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
}

