// src/components/AnalysisChartMonthly.tsx
'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getYearlyMonthlyAnalysis, MonthlyAnalysisData } from '@/services/kc2-monthly-analysis';
import { Loader2, CalendarDays, Filter } from 'lucide-react';

export default function AnalysisChartMonthly() {
  const [data, setData] = useState<MonthlyAnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý năm được chọn
  const currentSystemYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentSystemYear);

  // Tạo danh sách 5 năm để chọn (từ 3 năm trước đến 1 năm sau)
  const years = Array.from({ length: 5 }, (_, i) => currentSystemYear - 3 + i);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await getYearlyMonthlyAnalysis(selectedYear);
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedYear]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(e.target.value));
  };

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center text-slate-400 bg-white rounded-xl border border-slate-200">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        Đang tải dữ liệu năm {selectedYear}...
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      
      {/* HEADER: Tiêu đề + Bộ chọn năm */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-600" />
            Thống kê Theo Tháng - Năm {selectedYear}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tổng quan xu hướng lỗi và cảnh báo qua 12 tháng
          </p>
        </div>

        {/* Dropdown Chọn Năm */}
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <div className="pl-2">
            <Filter className="w-4 h-4 text-slate-400" />
          </div>
          <select 
            value={selectedYear}
            onChange={handleYearChange}
            className="bg-transparent text-sm font-semibold text-slate-700 py-1.5 px-2 outline-none cursor-pointer hover:text-purple-600 transition-colors"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                Năm {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* BIỂU ĐỒ (Hiển thị 12 cột) */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={4} // Tạo khoảng cách nhỏ giữa cột Lỗi và Cảnh báo
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />

            {/* Cột Lỗi */}
            <Bar dataKey="error_resolved" name="Lỗi (Đã xử lý)" stackId="errors" fill="#22c55e" radius={[0, 0, 4, 4]} barSize={35} />
            <Bar dataKey="error_active" name="Lỗi (Đang xảy ra)" stackId="errors" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={35} />

            {/* Cột Cảnh báo */}
            <Bar dataKey="warning_resolved" name="Cảnh báo (Đã xử lý)" stackId="warnings" fill="#60a5fa" radius={[0, 0, 4, 4]} barSize={35} />
            <Bar dataKey="warning_active" name="Cảnh báo (Đang xảy ra)" stackId="warnings" fill="#eab308" radius={[4, 4, 0, 0]} barSize={35} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}