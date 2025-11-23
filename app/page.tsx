'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  category: { name: string };
  categoryId: number;
  type: string;
  isPersonalizable: boolean;
  isHidden: boolean;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [showPersonalizableOnly, setShowPersonalizableOnly] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products?isHidden=false'),
        fetch('/api/categories'),
      ]);

      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error('Failed to fetch data from server');
      }

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Failed to fetch data', error);
      // Fallback to empty arrays to prevent crashes
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter((product) => {
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPersonalizable = showPersonalizableOnly ? product.isPersonalizable : true;
    return matchesCategory && matchesSearch && matchesPersonalizable;
  }) : [];

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Sublimados Suescun</h1>
          <div className="flex items-center gap-4">
             <Link href="/cart" className="text-gray-600 hover:text-blue-600 font-medium">
              Cart
            </Link>
            <Link href="/admin" className="text-gray-500 hover:text-gray-900 text-sm">
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPersonalizableOnly}
                  onChange={(e) => setShowPersonalizableOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-gray-700 text-sm">Personalizable Only</span>
              </label>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === null
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.name
                  : 'All Products'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {filteredProducts.length} products found
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-lg shadow text-center">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button 
                  onClick={() => {setSelectedCategory(null); setSearchQuery('');}}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
