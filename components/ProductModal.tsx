"use client";

import { X, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  images: string[] | string;
  category: { name: string };
  isPersonalizable: boolean;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
  const imageList = Array.isArray(images) ? images : [images];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="w-full md:w-1/2 relative bg-gray-100 flex items-center justify-center min-h-[300px]">
          {imageList.length > 0 ? (
            <img 
              src={imageList[currentImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-contain max-h-[500px]"
            />
          ) : (
            <div className="text-gray-400">No image available</div>
          )}

          {/* Carousel Controls */}
          {imageList.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {imageList.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                {product.category?.name}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {product.name}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="text-3xl font-bold text-gray-900 mb-6">
            ${product.price ? product.price.toFixed(2) : '0.00'}
          </div>

          <div className="prose prose-sm text-gray-600 mb-8 flex-grow">
            <p>{product.description || "No description available for this product."}</p>
          </div>

          {/* Contact Block */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-auto">
            <h3 className="text-green-800 font-semibold mb-2 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              ¿Te interesa este producto?
            </h3>
            <p className="text-green-700 text-sm mb-3">
              Contáctanos para más información o para realizar un pedido personalizado.
            </p>
            <div className="text-lg font-bold text-green-900">
              WhatsApp: +57 300 123 4567
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
