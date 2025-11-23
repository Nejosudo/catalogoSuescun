'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';

interface Order {
  id: number;
  customerName: string;
  customerContact: string;
  status: string;
  createdAt: string;
  items: any[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, REQUESTED, COMPLETED

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'ALL') return true;
    return order.status === filter;
  });

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded ${
            filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('REQUESTED')}
          className={`px-4 py-2 rounded ${
            filter === 'REQUESTED' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-black'
          }`}
        >
          Requested
        </button>
        <button
          onClick={() => setFilter('COMPLETED')}
          className={`px-4 py-2 rounded ${
            filter === 'COMPLETED' ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'
          }`}
        >
          Completed
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
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
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.customerName}
                  <div className="text-xs text-gray-500">{order.customerContact}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
