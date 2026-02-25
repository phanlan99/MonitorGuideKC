// src/components/AnalysisSidebar.tsx
import { BarChart3, Calendar, CalendarDays, LayoutDashboard, TrendingUp } from "lucide-react";

// Thêm 'trend' vào type
interface SidebarProps {
  activeTab: '7days' | 'weekly' | 'monthly' | 'trend';
  onTabChange: (tab: '7days' | 'weekly' | 'monthly' | 'trend') => void;
}

export default function AnalysisSidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
            Danh mục
          </h3>
        </div>
        
        <nav className="p-2 space-y-1">
          {/* Nút 1: 7 Ngày */}
          <button
            onClick={() => onTabChange('7days')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${activeTab === '7days' 
                ? 'bg-purple-50 text-purple-700 border border-purple-100 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <BarChart3 className="w-5 h-5" />
            7 ngày gần nhất
          </button>

          {/* Nút 2: Theo Tuần */}
          <button
            onClick={() => onTabChange('weekly')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${activeTab === 'weekly' 
                ? 'bg-purple-50 text-purple-700 border border-purple-100 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <Calendar className="w-5 h-5" />
            Thống kê theo Tuần
          </button>

          {/* Nút 3: Theo Tháng */}
          <button
            onClick={() => onTabChange('monthly')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${activeTab === 'monthly' 
                ? 'bg-purple-50 text-purple-700 border border-purple-100 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <CalendarDays className="w-5 h-5" />
            Thống kê theo Tháng
          </button>

          {/* MỚI: Nút 4: Theo Xu hướng (Trend) */}
          <button
            onClick={() => onTabChange('trend')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${activeTab === 'trend' 
                ? 'bg-purple-50 text-purple-700 border border-purple-100 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <TrendingUp className="w-5 h-5" />
            Xu hướng thời gian
          </button>
        </nav>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h4 className="text-blue-800 font-bold text-sm flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" />
          Ghi chú hệ thống
        </h4>
        <p className="text-blue-600 text-xs mt-2 leading-relaxed">
          Dữ liệu phân tích được tổng hợp tự động từ các bảng Alarm mới nhất trong MySQL.
        </p>
      </div>
    </aside>
  );
}