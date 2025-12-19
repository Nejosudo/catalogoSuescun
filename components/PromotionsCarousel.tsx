'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  images: string[] | string;
}

interface PromotionsCarouselProps<T extends Product> {
  products: T[];
  onProductClick: (product: T) => void;
}

export default function PromotionsCarousel<T extends Product>({ products, onProductClick }: PromotionsCarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const DURATION = 6000; 
  const INTERVAL = 50;   
  
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(DURATION);

  const resetTimer = () => {
    setProgress(0);
    remainingTimeRef.current = DURATION;
    startTimeRef.current = Date.now();
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
    resetTimer();
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    resetTimer();
  };

  useEffect(() => {
    if (products.length === 0) return;

    const tick = () => {
      if (isPaused) {
        startTimeRef.current = Date.now() - (DURATION - remainingTimeRef.current);
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = DURATION - elapsed;

      if (elapsed >= DURATION) {
        nextSlide();
      } else {
        const newProgress = (elapsed / DURATION) * 100;
        setProgress(newProgress);
      }
    };

    progressTimerRef.current = setInterval(tick, INTERVAL);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [currentIndex, isPaused, products.length]);

  if (products.length === 0) return null;

  const currentProduct = products[currentIndex];
  // Helper to parse images if they come as string to match BaseProduct interface
  const images = typeof currentProduct.images === 'string' 
    ? JSON.parse(currentProduct.images) 
    : currentProduct.images;
  const mainImage = images && images.length > 0 ? images[0] : '/placeholder.png';

  return (
    <div 
      className="relative w-full aspect-[21/9] md:aspect-[24/9] rounded-2xl overflow-hidden shadow-2xl group mb-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image */}
      <img
        src={mainImage}
        alt={currentProduct.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out transform hover:scale-105"
        onClick={() => onProductClick(currentProduct)}
        style={{ cursor: 'pointer' }}
      />
      
      {/* Overlay Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white pointer-events-none">
        <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg transform transition-all duration-500 translate-y-0">
          {currentProduct.name}
        </h2>
        <p className="text-lg md:text-xl font-light opacity-90 mb-4 text-purple-200">
          ¡Oferta exclusiva por tiempo limitado!
        </p>

        {/* Tags / Badges */}
        <span className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
          Promoción Destacada
        </span>
      </div>

      {/* Navigation Controls */}
      <button 
        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
      >
        <ChevronLeft size={32} />
      </button>
      
      <button 
        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
      >
        <ChevronRight size={32} />
      </button>

      {/* Progress Bar (Gradient) */}
      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-gray-800/50">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Slide Indicators */}
      <div className="absolute top-6 right-6 flex space-x-2">
        {products.map((_, idx) => (
          <div 
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
