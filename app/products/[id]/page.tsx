'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ShoppingCart, Upload, Check } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[] | string;
  category: { name: string };
  type: string;
  isPersonalizable: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [personalizationText, setPersonalizationText] = useState('');
  const [personalizationImage, setPersonalizationImage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      
      // Parse images
      if (typeof data.images === 'string') {
        data.images = JSON.parse(data.images);
      }
      
      setProduct(data);
      if (data.images && data.images.length > 0) {
        setSelectedImage(data.images[0]);
      } else {
        setSelectedImage('/placeholder.png');
      }
    } catch (error) {
      console.error('Failed to fetch product', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
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
        setPersonalizationImage(data.url);
      }
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage,
      quantity,
      personalizationImage: personalizationImage || undefined,
      personalizationText: personalizationText || undefined,
    });

    router.push('/cart');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const images = product.images as string[];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Catalog
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div>
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden mb-4 h-96">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      selectedImage === img ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                <span className="text-sm text-blue-600 font-semibold tracking-wide uppercase">
                  {product.category?.name}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
                <p className="text-2xl font-bold text-gray-900 mt-4">${product.price.toFixed(2)}</p>
              </div>

              <div className="prose prose-sm text-gray-500 mb-8">
                <p>{product.description}</p>
              </div>

              {/* Personalization Section */}
              {product.isPersonalizable && (
                <div className="bg-blue-50 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Personalize Your Order</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-black mb-1">
                      Description / Instructions
                    </label>
                    <textarea
                      value={personalizationText}
                      onChange={(e) => setPersonalizationText(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe how you want your product..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Reference Image (Optional)
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 flex items-center shadow-sm">
                        <Upload className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm text-black">Upload Image</span>
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                      {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                      {personalizationImage && (
                        <div className="flex items-center text-green-600 text-sm">
                          <Check className="w-4 h-4 mr-1" />
                          Image Uploaded
                        </div>
                      )}
                    </div>
                    {personalizationImage && (
                      <img 
                        src={personalizationImage} 
                        alt="Preview" 
                        className="mt-2 w-20 h-20 object-cover rounded border" 
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="w-24">
                  <label className="sr-only">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-center"
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700 flex items-center justify-center font-medium text-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
