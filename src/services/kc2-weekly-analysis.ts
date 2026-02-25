// src/services/kc2-weekly-analysis.ts
'use server'

import { db } from '@/lib/db';

export interface WeeklyAnalysisData {
  week: number;          
  label: string;         
  error_active: number;
  error_resolved: number;
  warning_active: number;
  warning_resolved: number;
}

export async function getYearlyWeeklyAnalysis(year: number): Promise<WeeklyAnalysisData[]> {
  try {
    const weeks: WeeklyAnalysisData[] = [];
    for (let i = 1; i <= 53; i++) {
      weeks.push({
        week: i,
        label: `Tuần ${i}`,
        error_active: 0,
        error_resolved: 0,
        warning_active: 0,
        warning_resolved: 0,
      });
    }

    const getCountByWeek = async (tableName: string) => {
      const sql = `
        SELECT WEEK(occurred_at, 1) as week_num, COUNT(*) as count 
        FROM ${tableName} 
        WHERE YEAR(occurred_at) = ?
        GROUP BY WEEK(occurred_at, 1)
      `;
      const [rows] = await db.query(sql, [year]);
      return rows as any[];
    };

    // === CHỈ SỬA TÊN BẢNG TẠI ĐÂY ===
    const [errActive, errResolved, warActive, warResolved] = await Promise.all([
      getCountByWeek('guidekc_alarm_new4'), // Thay vì guidekc_alarm4
      getCountByWeek('guidekc_alarm_new5'), // Thay vì guidekc_alarm5
      getCountByWeek('guidekc_alarm_new6'), // Thay vì guidekc_alarm6
      getCountByWeek('guidekc_alarm_new7'), // Thay vì guidekc_alarm7
    ]);

    const finalData = weeks.map(w => {
      const findCount = (rows: any[]) => {
        const row = rows.find((r: any) => r.week_num === w.week);
        return row ? row.count : 0;
      };

      return {
        ...w,
        error_active: findCount(errActive),
        error_resolved: findCount(errResolved),
        warning_active: findCount(warActive),
        warning_resolved: findCount(warResolved),
      };
    });

    return finalData;

  } catch (error) {
    console.error('Lỗi phân tích tuần:', error);
    return [];
  }
}