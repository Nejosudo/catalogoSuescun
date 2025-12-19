'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  price: number;
  category: { name: string };
  type: string;
  isHidden: boolean;
}

  // ... (previous imports)

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
  const [bulkType, setBulkType] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      
      // Extract unique types for filter
      const types = Array.from(new Set(data.map((p: Product) => p.type))).filter(Boolean) as string[];
      setUniqueTypes(types);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkVisibility = async (isHidden: boolean) => {
    if (!bulkType) return alert('Please select a type first');
    if (!confirm(`Are you sure you want to ${isHidden ? 'HIDE' : 'SHOW'} all products of type "${bulkType}"?`)) return;

    try {
      const res = await fetch('/api/products/bulk-visibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: bulkType, isHidden }),
      });

      if (res.ok) {
        alert('Bulk update successful');
        fetchProducts();
      } else {
        alert('Failed to update');
      }
    } catch (error) {
      console.error('Bulk update error', error);
    }
  };

  // ... (handleDelete, toggleHidden same as before)
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  const toggleHidden = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHidden: !product.isHidden }),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to toggle visibility', error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl text-gray-700 font-bold">Manage Products</h2>
        
        {/* Bulk Actions Control */}
        <div className="bg-gray-100 p-2 rounded flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600">Bulk Actions:</span>
          <select 
            value={bulkType} 
            onChange={(e) => setBulkType(e.target.value)}
            className="text-sm border-gray-300 rounded shadow-sm p-1 text-black"
          >
            <option value="">Select Type...</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button 
            onClick={() => handleBulkVisibility(true)}
            disabled={!bulkType}
            className="bg-gray-600 text-white text-xs px-2 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            Hide All
          </button>
          <button 
            onClick={() => handleBulkVisibility(false)}
            disabled={!bulkType}
            className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Show All
          </button>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category / Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium">{product.category?.name}</div>
                  <div className="text-xs text-gray-400">{product.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $ {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                 {(product as any).isPromotion && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                      Promo
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => toggleHidden(product)}
                    className={`flex items-center ${
                      product.isHidden ? 'text-gray-400' : 'text-green-600'
                    }`}
                  >
                    {product.isHidden ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" /> Hidden
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" /> Visible
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900 inline-block"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
