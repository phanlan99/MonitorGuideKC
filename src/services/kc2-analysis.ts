'use server'

import { db } from '@/lib/db';

export interface DailyAnalysisData {
  date: string;          // Ngày (VD: 12/02)
  fullDate: string;      // Ngày đầy đủ để query (2026-02-12)
  error_active: number;  // Số lượng đang lỗi (Alarm4)
  error_resolved: number;// Số lượng đã xử lý (Alarm5)
  warning_active: number;// Số lượng đang cảnh báo (Alarm6)
  warning_resolved: number; // Số lượng cảnh báo đã xử lý (Alarm7)
}

export async function getWeeklyAnalysis(): Promise<DailyAnalysisData[]> {
  try {
    // 1. Tạo mảng 7 ngày gần nhất (bao gồm hôm nay)
    const days: DailyAnalysisData[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      const displayStr = `${d.getDate()}/${d.getMonth() + 1}`; // DD/MM

      days.push({
        date: displayStr,
        fullDate: dateStr,
        error_active: 0,
        error_resolved: 0,
        warning_active: 0,
        warning_resolved: 0,
      });
    }

    // 2. Query đếm dữ liệu Group By ngày
    // Helper function để query count theo ngày
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

    // Chạy song song 4 query cho nhanh
    const [errActive, errResolved, warActive, warResolved] = await Promise.all([
      getCountByDate('guidekc_alarm4'),
      getCountByDate('guidekc_alarm5'),
      getCountByDate('guidekc_alarm6'),
      getCountByDate('guidekc_alarm7'),
    ]);

    // 3. Map dữ liệu từ DB vào mảng 7 ngày
    // Chúng ta duyệt qua từng ngày đã tạo sẵn, tìm xem trong DB có dữ liệu ngày đó không
    const finalData = days.map(day => {
      // Helper tìm số lượng trong mảng kết quả DB
      const findCount = (rows: any[]) => {
        const row = rows.find((r: any) => {
          // Convert date từ DB sang string YYYY-MM-DD để so sánh
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