'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center px-6 py-3 text-black hover:bg-gray-100 hover:text-red-600 transition-colors"
    >
      <LogOut className="w-5 h-5 mr-3" />
      Logout
    </button>
  );
}
