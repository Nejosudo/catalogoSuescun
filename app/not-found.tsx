'use client';

import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';

export default function NotFound() {
  const pathname = usePathname();
  // Check if URL suggests a product page (e.g., contains /products/ or /product/)
  const isProductUrl = pathname?.includes('/products/');

  const titleMessage = isProductUrl 
    ? "¡Uy! Este producto no existe" 
    : "Creo que te perdiste un poco, deberiamos volver al inicio...";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <Logo width={250} height={70} />
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8 transform transition-all hover:scale-105 duration-300">
          <div className="mb-6 flex justify-center">
            <div className="bg-red-50 p-4 rounded-full">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {titleMessage}
          </h1>
          
          <p className="text-gray-500 mb-8">
            La página que buscas no se encuentra disponible o ha sido movida.
          </p>

          <Link 
            href="/" 
            className="flex items-center justify-center w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md group"
          >
            <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Volver a la pagina principal
          </Link>
        </div>
      </div>
    </div>
  );
}
