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

export default function SplashScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
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

