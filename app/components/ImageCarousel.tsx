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

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="relative w-full h-full">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-30' : 'opacity-0'
            }`}
          >
            <Image
              src={src}
              alt={`Background image ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={75}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

