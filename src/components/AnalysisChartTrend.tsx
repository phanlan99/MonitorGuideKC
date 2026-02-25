'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTrendAnalysis, TrendAnalysisData } from '@/services/kc2-trend-analysis';
import { Loader2, TrendingUp, Search } from 'lucide-react';

export default function AnalysisChartTrend() {
  const [data, setData] = useState<TrendAnalysisData[]>([]);
  const [loading, setLoading] = useState(false);

  // Mặc định: Xem 30 ngày gần nhất
  const getDaysAgo = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getDaysAgo(30));
  const [endDate, setEndDate] = useState(getDaysAgo(0)); // Hôm nay

  const fetchTrendData = async () => {
    setLoading(true);
    try {
      const result = await getTrendAnalysis(startDate, endDate);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load lần đầu tiên
  useEffect(() => {
    fetchTrendData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrendData();
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      
      {/* FORM CHỌN KHOẢNG THỜI GIAN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Phân tích Xu hướng (Trend Line)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi sự gia tăng hoặc giảm thiểu sự cố qua các ngày
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 pl-2">Từ:</span>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 py-1 px-2 outline-none"
              required
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 pl-2">Đến:</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 py-1 px-2 outline-none"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </form>
      </div>
      
      {/* BIỂU ĐỒ ĐƯỜNG */}
      <div className="h-[400px] w-full">
        {loading && data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            Đang vẽ biểu đồ xu hướng...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />

              {/* === ĐƯỜNG LỖI === */}
              {/* Đang lỗi: Nét liền (Solid), dày hơn chút, màu đỏ */}
              <Line 
                type="monotone" 
                dataKey="error_active" 
                name="Lỗi (Đang xảy ra)" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ r: 3, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              {/* Đã xử lý: Nét đứt (Dashed), màu xanh lá */}
              <Line 
                type="monotone" 
                dataKey="error_resolved" 
                name="Lỗi (Đã xử lý)" 
                stroke="#22c55e" 
                strokeWidth={2}
                strokeDasharray="5 5" // Tạo nét đứt
                dot={{ r: 3 }}
              />

              {/* === ĐƯỜNG CẢNH BÁO === */}
              {/* Đang cảnh báo: Nét liền, màu vàng cam */}
              <Line 
                type="monotone" 
                dataKey="warning_active" 
                name="Cảnh báo (Đang xảy ra)" 
                stroke="#eab308" 
                strokeWidth={3}
                dot={{ r: 3, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              {/* Cảnh báo đã xử lý: Nét đứt, màu xanh dương nhạt */}
              <Line 
                type="monotone" 
                dataKey="warning_resolved" 
                name="Cảnh báo (Đã xử lý)" 
                stroke="#60a5fa" 
                strokeWidth={2}
                strokeDasharray="5 5" // Tạo nét đứt
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}