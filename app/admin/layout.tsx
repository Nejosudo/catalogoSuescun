import Link from 'next/link';
import { Metadata } from 'next';
import { LayoutDashboard, Package, List, Home } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';
import Logo from '@/components/Logo';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: "Administracion Suescun",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}