'use server'

import { db } from '@/lib/db';

export interface TrendAnalysisData {
  date: string;          // DD/MM
  fullDate: string;      // YYYY-MM-DD
  error_active: number;
  error_resolved: number;
  warning_active: number;
  warning_resolved: number;
}

export async function getTrendAnalysis(startDateStr: string, endDateStr: string): Promise<TrendAnalysisData[]> {
  try {
    const trendData: TrendAnalysisData[] = [];
    
    // 1. Tạo mảng các ngày liên tiếp từ startDate đến endDate
    let currentDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Chống treo vòng lặp nếu người dùng nhập sai (end < start) hoặc khoảng quá lớn (> 365 ngày)
    if (currentDate > endDate) return [];
    
    let loopCount = 0;
    while (currentDate <= endDate && loopCount <= 365) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const displayStr = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
      
      trendData.push({
        date: displayStr,
        fullDate: dateStr,
        error_active: 0,
        error_resolved: 0,
        warning_active: 0,
        warning_resolved: 0,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
      loopCount++;
    }

    // 2. Query DB theo khoảng thời gian
    const getCountByDateRange = async (tableName: string) => {
      const sql = `
        SELECT DATE(occurred_at) as log_date, COUNT(*) as count 
        FROM ${tableName} 
        WHERE occurred_at >= ? AND occurred_at <= ?
        GROUP BY DATE(occurred_at)
      `;
      // Thêm 23:59:59 vào ngày kết thúc để lấy trọn vẹn ngày đó
      const [rows] = await db.query(sql, [`${startDateStr} 00:00:00`, `${endDateStr} 23:59:59`]);
      return rows as any[];
    };

    // 3. Chạy 4 query song song (Dùng bảng _new)
    const [errActive, errResolved, warActive, warResolved] = await Promise.all([
      getCountByDateRange('guidekc_alarm_new4'),
      getCountByDateRange('guidekc_alarm_new5'),
      getCountByDateRange('guidekc_alarm_new6'),
      getCountByDateRange('guidekc_alarm_new7'),
    ]);

    // 4. Map dữ liệu vào mảng ngày đã tạo
    const finalData = trendData.map(day => {
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
    console.error('Lỗi phân tích xu hướng:', error);
    return [];
  }
}