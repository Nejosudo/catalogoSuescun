import Link from 'next/link';
import { Tag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[] | string;
  category: { name: string };
  isPersonalizable: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  // Parse images if string
  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  const mainImage = images.length > 0 ? images[0] : '/placeholder.png';

  return (
   // Para hacer clickeable el ProductCard cambiar el primer div -> Link y agregar la ruta
    // href={`/products/${product.id}`}
    <div className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-64 overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          {product.isPersonalizable && (
            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow">
              <Tag className="w-3 h-3 mr-1" />
              Personalizable
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            {product.category?.name}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {product.name}
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {/* <span className="text-sm text-blue-600 font-medium group-hover:underline">
              View Details
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
