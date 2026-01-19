'use client';

import { useEffect, useState } from 'react';

interface DominantColorExtractorProps {
  imageUrl: string;
  onColorExtracted: (color: string) => void;
}

export default function DominantColorExtractor({ imageUrl, onColorExtracted }: DominantColorExtractorProps) {
  useEffect(() => {
    const extractDominantColor = async () => {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) return;
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Échantillonner les pixels (prendre un échantillon pour la performance)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          // Analyser les couleurs (échantillonner tous les 100 pixels pour la performance)
          const colorCounts: Record<string, number> = {};
          const step = 100;
          
          for (let i = 0; i < pixels.length; i += step * 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Ignorer les pixels transparents ou très sombres
            if (a < 128) continue;
            
            // Quantifier les couleurs (grouper les couleurs similaires)
            const quantizedR = Math.floor(r / 32) * 32;
            const quantizedG = Math.floor(g / 32) * 32;
            const quantizedB = Math.floor(b / 32) * 32;
            
            const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
            colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
          }
          
          // Trouver la couleur la plus fréquente
          let maxCount = 0;
          let dominantColor = 'rgb(0, 255, 0)'; // Couleur par défaut (vert)
          
          for (const [color, count] of Object.entries(colorCounts)) {
            if (count > maxCount) {
              maxCount = count;
              const [r, g, b] = color.split(',').map(Number);
              dominantColor = `rgb(${r}, ${g}, ${b})`;
            }
          }
          
          onColorExtracted(dominantColor);
        };
        
        img.onerror = () => {
          console.error('Erreur lors du chargement de l\'image pour l\'extraction de couleur');
          // Couleur par défaut en cas d'erreur
          onColorExtracted('rgb(0, 255, 0)');
        };
        
        img.src = imageUrl;
      } catch (error) {
        console.error('Erreur lors de l\'extraction de la couleur dominante:', error);
        onColorExtracted('rgb(0, 255, 0)');
      }
    };
    
    extractDominantColor();
  }, [imageUrl, onColorExtracted]);
  
  return null;
}
