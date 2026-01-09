'use client';

import { useState, useEffect } from 'react';

export default function Navigation() {
  const [time, setTime] = useState('00:00');

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

  return (
    <nav className="fixed top-0 left-0 w-full px-12 py-6 flex justify-between items-center z-[1000] mix-blend-difference">
      <a href="/" className="font-['Dela_Gothic_One',sans-serif] text-2xl tracking-[0.15em] bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent no-underline relative">
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
          <a href="#collection" className="text-white no-underline text-[0.65rem] tracking-[0.2em] uppercase flex items-center gap-3 transition-all hover:bg-gradient-to-r hover:from-green-500 hover:to-yellow-500 hover:bg-clip-text hover:text-transparent">
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
      </ul>

      <button className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2.5">
        <span className="w-6 h-0.5 bg-white transition-all"></span>
        <span className="w-6 h-0.5 bg-white transition-all"></span>
        <span className="w-6 h-0.5 bg-white transition-all"></span>
      </button>
    </nav>
  );
}

