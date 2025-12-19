import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, List } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-6 flex-1">
          <Link
            href="/admin/products"
            className="flex items-center px-6 py-3 text-black hover:bg-gray-100 hover:text-blue-600"
          >
            <Package className="w-5 h-5 mr-3" />
            Products
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center px-6 py-3 text-black hover:bg-gray-100 hover:text-blue-600"
          >
            Categories
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center px-6 py-3 text-black hover:bg-gray-100 hover:text-blue-600"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>
        
        {/* Logout Section */}
        <div className="p-4 border-t border-gray-200">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}