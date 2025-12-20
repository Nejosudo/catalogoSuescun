'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, List, Home, Menu, X } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';
import Logo from '@/components/Logo';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-md flex flex-col transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex justify-center md:justify-start">
          <Logo width={160} height={40} />
        </div>

        <nav className="mt-6 flex-1 px-4 space-y-2">
          <Link
            href="/admin/products"
            onClick={() => setIsOpen(false)}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive('/admin/products')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <Package className="w-5 h-5 mr-3" />
            Products
          </Link>

          <Link
            href="/admin/categories"
            onClick={() => setIsOpen(false)}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive('/admin/categories')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <List className="w-5 h-5 mr-3" />
            Categories
          </Link>

          <Link
            href="/admin/settings"
            onClick={() => setIsOpen(false)}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive('/admin/settings')
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>
        
        {/* Logout Section */}
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors mb-2 rounded-lg"
          >
            <Home className="w-5 h-5 mr-3" />
            Home
          </Link>
          <div className="px-4">
             <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
