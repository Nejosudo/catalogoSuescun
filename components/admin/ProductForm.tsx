'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: number;
  type: string;
  isPersonalizable: boolean;
  isHidden: boolean;
}

interface ProductFormProps {
  initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    images: [],
    categoryId: 0,
    type: '',
    isPersonalizable: false,
    isHidden: false,
    ...initialData,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
    if (!initialData && data.length > 0) {
      setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, data.url],
        }));
      }
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData ? `/api/products/${initialData.id}` : '/api/products';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to save product', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-black">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Type (e.g., Mug, Keychain)</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPersonalizable"
              checked={formData.isPersonalizable}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Personalizable</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isHidden"
              checked={formData.isHidden}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Hidden</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Images</label>
          <div className="mt-2 flex items-center gap-4 flex-wrap">
            {formData.images.map((url, index) => (
              <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                <img src={url} alt="Product" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-blue-500">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Upload</span>
              <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </form>
  );
}
