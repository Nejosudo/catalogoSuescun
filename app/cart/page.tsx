'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeFromCart, clearCart, total } = useCart();
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerContact,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            personalizationImage: item.personalizationImage,
            personalizationText: item.personalizationText,
          })),
        }),
      });

      if (res.ok) {
        clearCart();
        alert('Order placed successfully!');
        router.push('/');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order submission failed', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 space-y-6">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0">
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-lg font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Quantity: {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                    
                    {(item.personalizationImage || item.personalizationText) && (
                      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <p className="font-medium">Personalization:</p>
                        {item.personalizationText && <p>"{item.personalizationText}"</p>}
                        {item.personalizationImage && <p className="text-blue-500">Image attached</p>}
                      </div>
                    )}

                    <button
                      onClick={() => removeFromCart(index)}
                      className="mt-4 text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Form */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="flex justify-between mb-4 text-lg font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <hr className="border-gray-200 my-6" />

              <h3 className="font-semibold mb-4">Contact Information</h3>
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black">Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black">Contact (Phone/Email)</label>
                  <input
                    type="text"
                    required
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Phone number or Email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-md shadow hover:bg-green-700 font-bold text-lg disabled:opacity-50"
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
