'use client';

import { useState, useEffect } from 'react';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 3;
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
  }, []);

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100000] bg-black flex items-center justify-center flex-col transition-all duration-800 ${
        isHidden ? 'pointer-events-none' : ''
      }`}
      style={{
        clipPath: isHidden ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[300px] h-[300px] top-[20%] left-[20%] border animate-spin opacity-10" style={{ animationDuration: '20s', borderImage: 'linear-gradient(to right, #00FF00, #FFFF00) 1' }}></div>
        <div className="absolute w-[400px] h-[400px] bottom-[20%] right-[20%] border border-[#FF0033]/5 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
      </div>
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
  );
}

