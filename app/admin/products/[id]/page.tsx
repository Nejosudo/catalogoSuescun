'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      
      // Parse images if it's a string (from DB)
      if (typeof data.images === 'string') {
        data.images = JSON.parse(data.images);
      }
      
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <ProductForm initialData={product} />
    </div>
  );
}
