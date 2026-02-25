// src/components/AnalysisChart7ngay1.tsx
'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getKC1Analysis7Days } from '@/services/kc1-analysis-services'; // Đã đổi
import { Loader2 } from 'lucide-react';

// Định nghĩa kiểu dữ liệu (nếu trong service chưa có export)
interface DailyAnalysisData {
  date: string;
  error_active: number;
  error_resolved: number;
  warning_active: number;
  warning_resolved: number;
}

export default function AnalysisChart7ngay1() { // Đã đổi tên
  const [data, setData] = useState<DailyAnalysisData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getKC1Analysis7Days(); // Đã đổi hàm
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        Đang phân tích dữ liệu...
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">
        Biểu đồ thống kê Lỗi & Cảnh báo (7 ngày gần nhất)
      </h3>
      
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />

          {/* === CỘT 1: NHÓM LỖI (Stack Errors) === */}
          <Bar dataKey="error_resolved" name="Lỗi (Đã xử lý)" stackId="errors" fill="#22c55e" radius={[0, 0, 4, 4]} barSize={50} />
          <Bar dataKey="error_active" name="Lỗi (Đang xảy ra)" stackId="errors" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={50} />

          {/* === CỘT 2: NHÓM CẢNH BÁO (Stack Warnings) === */}
          <Bar dataKey="warning_resolved" name="Cảnh báo (Đã xử lý)" stackId="warnings" fill="#60a5fa" radius={[0, 0, 4, 4]} barSize={50} />
          <Bar dataKey="warning_active" name="Cảnh báo (Đang xảy ra)" stackId="warnings" fill="#eab308" radius={[4, 4, 0, 0]} barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}