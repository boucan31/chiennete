'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const mainImage = images[selectedImageIndex];

  return (
    <div className="space-y-4">
      {/* Image principale */}
      {mainImage && (
        <div className="aspect-square relative bg-[#111111] overflow-hidden">
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      )}
      
      {/* Miniatures */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square relative bg-[#111111] overflow-hidden transition-all duration-300 ${
                selectedImageIndex === index
                  ? 'ring-2 ring-green-500 opacity-100'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12.5vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

