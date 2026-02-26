// src/app/kc2/analysis/LogoutButton.tsx
'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/services/auth-service';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.refresh(); 
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors h-10"
    >
      <LogOut className="w-4 h-4" />
      Đăng xuất
    </button>
  );
}