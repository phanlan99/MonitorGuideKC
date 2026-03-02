// src/components/AnalysisChartWeekly1.tsx
'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getKC1AnalysisWeekly } from '@/services/kc1-analysis-services'; 
import { Loader2, ChevronLeft, ChevronRight, Calendar, Filter } from 'lucide-react';

// IMPORT COMPONENT PHÂN TRANG CHÚNG TA VỪA TẠO
import AnalysisWeeklyStats1 from './AnalysisWeeklyStats1'; 

interface WeeklyAnalysisData {
  label: string;
  error_active: number;
  error_resolved: number;
  warning_active: number;
  warning_resolved: number;
}

const ITEMS_PER_PAGE = 7;

export default function AnalysisChartWeekly1() { 
  const [data, setData] = useState<WeeklyAnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const currentSystemYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentSystemYear - 3 + i);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await getKC1AnalysisWeekly(selectedYear); 
        setData(result);
        
        if (selectedYear === currentSystemYear) {
            const currentWeek = getWeekNumber(new Date());
            const initialPage = Math.ceil(currentWeek / ITEMS_PER_PAGE);
            setCurrentPage(initialPage > 0 ? initialPage : 1);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedYear]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
  }

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
    <div className="flex flex-col gap-6">
      {/* 1. KHUNG BIỂU ĐỒ */}
      <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Thống kê Tuần - Năm {selectedYear}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Hiển thị dữ liệu tổng hợp 52 tuần của năm {selectedYear}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <div className="pl-2"><Filter className="w-4 h-4 text-slate-400" /></div>
            <select 
              value={selectedYear}
              onChange={handleYearChange}
              className="bg-transparent text-sm font-semibold text-slate-700 py-1.5 px-2 outline-none cursor-pointer hover:text-purple-600 transition-colors"
            >
              {years.map((year) => (
                <option key={year} value={year}>Năm {year}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />

              <Bar dataKey="error_resolved" name="Lỗi (Đã xử lý)" stackId="errors" fill="#22c55e" radius={[0, 0, 4, 4]} barSize={40} />
              <Bar dataKey="error_active" name="Lỗi (Đang xảy ra)" stackId="errors" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="warning_resolved" name="Cảnh báo (Đã xử lý)" stackId="warnings" fill="#60a5fa" radius={[0, 0, 4, 4]} barSize={40} />
              <Bar dataKey="warning_active" name="Cảnh báo (Đang xảy ra)" stackId="warnings" fill="#eab308" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Trước
          </button>

          <span className="text-sm font-semibold text-slate-700">
            Hiển thị tuần {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, data.length)} 
            <span className="text-slate-400 mx-2">|</span> 
            Trang {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Tiếp <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. GỌI BẢNG THỐNG KÊ CHI TIẾT KÈM PHÂN TRANG */}
      <AnalysisWeeklyStats1 selectedYear={selectedYear} />

    </div>
  );
}