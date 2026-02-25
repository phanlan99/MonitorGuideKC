// src/app/kc2/analysis/page.tsx
'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import AnalysisChart7ngay from "@/components/AnalysisChart7ngay";
import AnalysisChartWeekly from "@/components/AnalysisChartWeekly";
import AnalysisChartMonthly from "@/components/AnalysisChartMonthly"; // <-- Import biểu đồ tháng
import AnalysisSidebar from "@/components/AnalysisSidebar";
import { PieChart } from "lucide-react";

export default function KC2AnalysisPage() {
  // Thêm type 'monthly' vào state
  const [activeTab, setActiveTab] = useState<'7days' | 'weekly' | 'monthly'>('7days');

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <PieChart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Phân tích dữ liệu GuideKC #2
            </h1>
            <p className="text-slate-600">
              Trung tâm báo cáo và thống kê hiệu suất vận hành theo đa chiều thời gian.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          
          <AnalysisSidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          <section className="flex-1 min-h-[500px]">
            
            {activeTab === '7days' && (
              <div className="animate-in fade-in zoom-in duration-300">
                 <AnalysisChart7ngay />
              </div>
            )}

            {activeTab === 'weekly' && (
              <div className="animate-in fade-in zoom-in duration-300">
                <AnalysisChartWeekly />
              </div>
            )}

            {/* MỚI: Tab thống kê tháng */}
            {activeTab === 'monthly' && (
              <div className="animate-in fade-in zoom-in duration-300">
                <AnalysisChartMonthly />
              </div>
            )}

          </section>

        </div>
        
      </div>
    </main>
  );
}