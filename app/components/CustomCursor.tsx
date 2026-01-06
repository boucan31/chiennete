'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
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
      document.removeEventListener('mousemove', updateCursor);
      hoverElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        className={`fixed pointer-events-none z-[99999] transition-all duration-150 mix-blend-difference ${
          isActive ? 'w-[60px] h-[60px] border-red-500 rotate-45 rounded-none' : 'w-5 h-5 rounded-full'
        }`}
        style={{
          border: isActive ? '2px solid #FF0033' : '2px solid',
          borderImage: isActive ? 'none' : 'linear-gradient(to right, #00FF00, #FFFF00) 1',
        }}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) ${isActive ? 'rotate(45deg)' : ''}`,
          border: '2px solid',
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

