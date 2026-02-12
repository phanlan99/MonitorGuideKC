// src/components/Navbar.tsx
import Link from 'next/link';
// Thêm icon PieChart vào đây
import { Monitor, ChevronDown, Activity, History, AlertTriangle, PieChart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-2">
            <Monitor className="h-6 w-6 text-blue-400" />
            <Link href="/" className="font-bold text-xl tracking-wide hover:text-blue-300 transition-colors">
              Monitor GuideKC
            </Link>
          </div>

          <div className="flex space-x-6">
            <NavDropdown title="GuideKC #1" baseUrl="/kc1" />
            <NavDropdown title="GuideKC #2" baseUrl="/kc2" />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Cập nhật Component Dropdown: Thêm mục Phân tích
function NavDropdown({ title, baseUrl }: { title: string; baseUrl: string }) {
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

        {/* Mục 3: MỚI - Phân tích */}
        <Link 
          href={`${baseUrl}/analysis`} 
          className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-green-400" /> {/* Icon biểu đồ */}
            <span>Phân tích dữ liệu</span>
          </div>
        </Link>

      </div>
    </div>
  );
}