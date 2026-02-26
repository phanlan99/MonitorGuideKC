'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Monitor, ChevronDown, Activity, History, AlertTriangle, PieChart, Menu, X 
} from 'lucide-react';

export default function Navbar() {
  // State quản lý mở/đóng toàn bộ menu trên điện thoại
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State quản lý việc mở/đóng từng menu con (kc1 hoặc kc2)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownClick = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* === LOGO === */}
          <div className="flex items-center gap-2">
            <Monitor className="h-6 w-6 text-blue-400" />
            <Link 
              href="/" 
              onClick={closeMobileMenu}
              className="font-bold text-xl tracking-wide hover:text-blue-300 transition-colors"
            >
              Monitor GuideKC
            </Link>
          </div>

          {/* === MENU DESKTOP (Máy tính) === */}
          <div className="hidden md:flex space-x-6">
            <DesktopDropdown title="GuideKC #1" baseUrl="/kc1" />
            <DesktopDropdown title="GuideKC #2" baseUrl="/kc2" />
          </div>

          {/* === NÚT HAMBURGER (Điện thoại) === */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-md focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* === MENU MOBILE (Điện thoại) === */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700 absolute w-full shadow-xl">
          <div className="px-4 py-4 space-y-2 max-h-[calc(100vh-64px)] overflow-y-auto">
            
            <MobileDropdown 
              title="GuideKC #1" 
              baseUrl="/kc1" 
              isOpen={openDropdown === 'kc1'} 
              onToggle={() => handleDropdownClick('kc1')}
              onCloseMenu={closeMobileMenu}
            />
            
            <MobileDropdown 
              title="GuideKC #2" 
              baseUrl="/kc2" 
              isOpen={openDropdown === 'kc2'} 
              onToggle={() => handleDropdownClick('kc2')}
              onCloseMenu={closeMobileMenu}
            />

          </div>
        </div>
      )}
    </nav>
  );
}

// ==========================================
// 1. COMPONENT DROPDOWN CHO MÁY TÍNH (HOVER)
// Giao diện và màu sắc giữ nguyên 100% của bạn
// ==========================================
function DesktopDropdown({ title, baseUrl }: { title: string; baseUrl: string }) {
  return (
    <div className="relative group py-4">
      <button className="flex items-center gap-1 text-slate-300 group-hover:text-white font-medium transition-colors">
        {title}
        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
      </button>

      <div className="absolute left-0 mt-2 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
        
        {/* Mục 1: Theo dõi lỗi */}
        <Link 
          href={`${baseUrl}/monitor`} 
          className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white border-b border-slate-700/50"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span>Theo dõi lỗi</span>
          </div>
        </Link>

        {/* Mục 2: Lịch sử máy */}
        <Link 
          href={`${baseUrl}/history`} 
          className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white border-b border-slate-700/50"
        >
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-blue-400" />
            <span>Lịch sử máy</span>
          </div>
        </Link>

        {/* Mục 3: Phân tích */}
        <Link 
          href={`${baseUrl}/analysis`} 
          className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-green-400" />
            <span>Phân tích dữ liệu</span>
          </div>
        </Link>

      </div>
    </div>
  );
}

// ==========================================
// 2. COMPONENT DROPDOWN CHO ĐIỆN THOẠI (CLICK)
// Kế thừa phong cách Dark Mode của bạn
// ==========================================
function MobileDropdown({ 
  title, 
  baseUrl, 
  isOpen, 
  onToggle, 
  onCloseMenu 
}: { 
  title: string; 
  baseUrl: string; 
  isOpen: boolean; 
  onToggle: () => void;
  onCloseMenu: () => void;
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-800">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="bg-slate-900/50 border-t border-slate-800 flex flex-col">
          <Link 
            href={`${baseUrl}/monitor`} 
            onClick={onCloseMenu}
            className="flex items-center gap-3 px-6 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-b border-slate-800/50"
          >
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span>Theo dõi lỗi</span>
          </Link>

          <Link 
            href={`${baseUrl}/history`} 
            onClick={onCloseMenu}
            className="flex items-center gap-3 px-6 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-b border-slate-800/50"
          >
            <History className="h-4 w-4 text-blue-400" />
            <span>Lịch sử máy</span>
          </Link>

          <Link 
            href={`${baseUrl}/analysis`} 
            onClick={onCloseMenu}
            className="flex items-center gap-3 px-6 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <PieChart className="h-4 w-4 text-green-400" />
            <span>Phân tích dữ liệu</span>
          </Link>
        </div>
      )}
    </div>
  );
}