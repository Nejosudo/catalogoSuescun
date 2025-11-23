'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
  personalizationImage?: string;
  personalizationText?: string;
}

interface Order {
  id: number;
  customerName: string;
  customerContact: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async () => {
    if (!order) return;
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });
      if (res.ok) {
        fetchOrder(order.id.toString());
      }
    } catch (error) {
      console.error('Failed to update order', error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!order) return <div className="p-8">Order not found</div>;

  const total = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div>
      <Link href="/admin/orders" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Link>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Order #{order.id}</h2>
            <p className="text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
            <div className="mt-4">
              <h3 className="font-semibold">Customer Details</h3>
              <p>{order.customerName}</p>
              <p>{order.customerContact}</p>
            </div>
          </div>
          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                order.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {order.status}
            </span>
            {order.status !== 'COMPLETED' && (
              <button
                onClick={markAsCompleted}
                className="ml-4 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Ready
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-semibold mb-4">Order Items</h3>
          <div className="space-y-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex border-b border-gray-100 pb-6 last:border-0">
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{item.product.name}</h4>
                  <p className="text-gray-500">
                    Quantity: {item.quantity} x ${item.product.price.toFixed(2)}
                  </p>
                  
                  {(item.personalizationImage || item.personalizationText) && (
                    <div className="mt-4 bg-gray-50 p-4 rounded">
                      <h5 className="text-sm font-semibold text-black mb-2">Personalization</h5>
                      {item.personalizationText && (
                        <p className="text-sm text-gray-600 mb-2">
                          Note: {item.personalizationText}
                        </p>
                      )}
                      {item.personalizationImage && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Reference Image:</p>
                          <a 
                            href={item.personalizationImage} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View / Download Image
                          </a>
                          <img 
                            src={item.personalizationImage} 
                            alt="Reference" 
                            className="mt-2 w-32 h-32 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right text-xl font-bold">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
