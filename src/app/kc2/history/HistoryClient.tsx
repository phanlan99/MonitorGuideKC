'use client';

import { useState } from 'react';
import { Search, Filter, AlertTriangle, AlertOctagon, CheckCircle, Activity, CalendarClock, Box } from 'lucide-react';
import { searchKC2History, HistoryItem, HistoryFilter } from '@/services/kc2-service';

export default function HistoryClient() {
  
  const getLocalNow = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const getStartOfDay = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const offset = now.getTimezoneOffset() * 60000;
    return (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
  };

  // THÊM: productInfo vào state mặc định
  const [filters, setFilters] = useState<HistoryFilter>({
    startDate: getStartOfDay(), 
    endDate: getLocalNow(),     
    errorCode: '',
    content: '',
    productInfo: '', // <--- THÊM MỚI
    status: 'all',
    type: 'all'
  });

  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    try {
      const results = await searchKC2History(filters);
      setData(results);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      
      {/* === FORM TÌM KIẾM === */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-blue-600" />
          Tra cứu theo thời gian thực
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Từ thời điểm</label>
            <input 
              type="datetime-local" 
              required
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Đến thời điểm</label>
            <input 
              type="datetime-local" 
              required
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Mã lỗi (M)</label>
            <input 
              type="number" 
              placeholder="VD: 2001"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={filters.errorCode}
              onChange={(e) => setFilters({...filters, errorCode: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Nội dung</label>
            <input 
              type="text" 
              placeholder="Nội dung lỗi..."
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={filters.content}
              onChange={(e) => setFilters({...filters, content: e.target.value})}
            />
          </div>

          {/* Ô INPUT MỚI: MÃ HÀNG */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Mã hàng</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Box className="h-4 w-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="VD: MST-5-10"
                className="w-full pl-9 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.productInfo || ''}
                onChange={(e) => setFilters({...filters, productInfo: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Loại sự cố</label>
            <select 
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value as any})}
            >
              <option value="all">Tất cả</option>
              <option value="error">Lỗi (Error)</option>
              <option value="warning">Cảnh báo (Warning)</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Trạng thái</label>
            <select 
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value as any})}
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang xảy ra</option>
              <option value="resolved">Đã xử lý</option>
            </select>
          </div>

          {/* Nút tìm kiếm đẩy sang cuối cùng */}
          <div className="flex items-end">
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"
            >
              {loading ? <span>Đang tra cứu...</span> : <><Search className="w-5 h-5" /> Tìm kiếm</>}
            </button>
          </div>
        </div>
      </form>

      {/* === BẢNG KẾT QUẢ === */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
            <CalendarClock className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Chọn điều kiện và nhấn Tìm kiếm</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4 border-b">Thời gian</th>
                  <th className="px-6 py-4 border-b">Loại</th>
                  <th className="px-6 py-4 border-b">Mã (M)</th>
                  {/* THÊM CỘT MÃ HÀNG */}
                  <th className="px-6 py-4 border-b">Mã hàng</th>
                  <th className="px-6 py-4 border-b">Nội dung</th>
                  <th className="px-6 py-4 border-b">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">
                      Không tìm thấy dữ liệu phù hợp.
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono whitespace-nowrap">
                        {new Date(item.occurred_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        {item.type === 'error' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-200">
                            <AlertOctagon className="w-3 h-3" /> Lỗi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-yellow-50 text-yellow-600 border border-yellow-200">
                            <AlertTriangle className="w-3 h-3" /> Cảnh báo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">M{item.error_code}</td>
                      
                      {/* HIỂN THỊ DỮ LIỆU MÃ HÀNG */}
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Box className="w-4 h-4 text-blue-400" />
                          {item.product_info}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">{item.error_content}</td>
                      <td className="px-6 py-4">
                        {item.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-red-600 font-medium text-sm animate-pulse">
                            <Activity className="w-4 h-4" /> Đang xảy ra
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-green-600 font-medium text-sm">
                            <CheckCircle className="w-4 h-4" /> Đã xử lý
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}