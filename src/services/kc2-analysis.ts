// src/services/kc2-analysis.ts
'use server'

import { db } from '@/lib/db';

export interface DailyAnalysisData {
  date: string;          
  fullDate: string;      
  error_active: number;  
  error_resolved: number;
  warning_active: number;
  warning_resolved: number; 
}

export async function getWeeklyAnalysis(): Promise<DailyAnalysisData[]> {
  try {
    const days: DailyAnalysisData[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayStr = `${d.getDate()}/${d.getMonth() + 1}`; 

      days.push({
        date: displayStr,
        fullDate: dateStr,
        error_active: 0,
        error_resolved: 0,
        warning_active: 0,
        warning_resolved: 0,
      });
    }

    const getCountByDate = async (tableName: string) => {
      const sql = `
        SELECT DATE(occurred_at) as log_date, COUNT(*) as count 
        FROM ${tableName} 
        WHERE occurred_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(occurred_at)
      `;
      const [rows] = await db.query(sql);
      return rows as any[];
    };

    // === CHỈ SỬA TÊN BẢNG TẠI ĐÂY ===
    const [errActive, errResolved, warActive, warResolved] = await Promise.all([
      getCountByDate('guidekc_alarm_new4'), // Thay vì guidekc_alarm4
      getCountByDate('guidekc_alarm_new5'), // Thay vì guidekc_alarm5
      getCountByDate('guidekc_alarm_new6'), // Thay vì guidekc_alarm6
      getCountByDate('guidekc_alarm_new7'), // Thay vì guidekc_alarm7
    ]);

    const finalData = days.map(day => {
      const findCount = (rows: any[]) => {
        const row = rows.find((r: any) => {
          const dbDate = new Date(r.log_date).toISOString().split('T')[0];
          return dbDate === day.fullDate;
        });
        return row ? row.count : 0;
      };

      return {
        ...day,
        error_active: findCount(errActive),
        error_resolved: findCount(errResolved),
        warning_active: findCount(warActive),
        warning_resolved: findCount(warResolved),
      };
    });

    return finalData;

  } catch (error) {
    console.error('Lỗi phân tích dữ liệu:', error);
    return [];
  }
}