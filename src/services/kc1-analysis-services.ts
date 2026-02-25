'use server'

import { db } from '@/lib/db';

// 1. Phân tích 7 ngày
export async function getKC1Analysis7Days() {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { date: `${d.getDate()}/${d.getMonth() + 1}`, fullDate: d.toISOString().split('T')[0], error_active: 0, error_resolved: 0, warning_active: 0, warning_resolved: 0 };
  });

  const getCount = async (tb: string) => db.query(`SELECT DATE(occurred_at) as log_date, COUNT(*) as count FROM ${tb} WHERE occurred_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY DATE(occurred_at)`).then(r => r[0] as any[]);
  
  const [errA, errR, warA, warR] = await Promise.all([getCount('guidekc_alarm_new'), getCount('guidekc_alarm1_new'), getCount('guidekc_alarm2_new'), getCount('guidekc_alarm3_new')]);

  return days.map(day => {
    const find = (rows: any[]) => rows.find((r: any) => new Date(r.log_date).toISOString().split('T')[0] === day.fullDate)?.count || 0;
    return { ...day, error_active: find(errA), error_resolved: find(errR), warning_active: find(warA), warning_resolved: find(warR) };
  });
}

// 2. Phân tích Tuần (52 Tuần)
export async function getKC1AnalysisWeekly(year: number) {
  const weeks = Array.from({ length: 53 }, (_, i) => ({ week: i + 1, label: `Tuần ${i + 1}`, error_active: 0, error_resolved: 0, warning_active: 0, warning_resolved: 0 }));

  const getCount = async (tb: string) => db.query(`SELECT WEEK(occurred_at, 1) as week_num, COUNT(*) as count FROM ${tb} WHERE YEAR(occurred_at) = ? GROUP BY WEEK(occurred_at, 1)`, [year]).then(r => r[0] as any[]);

  const [errA, errR, warA, warR] = await Promise.all([getCount('guidekc_alarm_new'), getCount('guidekc_alarm1_new'), getCount('guidekc_alarm2_new'), getCount('guidekc_alarm3_new')]);

  return weeks.map(w => {
    const find = (rows: any[]) => rows.find((r: any) => r.week_num === w.week)?.count || 0;
    return { ...w, error_active: find(errA), error_resolved: find(errR), warning_active: find(warA), warning_resolved: find(warR) };
  });
}

// 3. Phân tích Tháng (12 Tháng)
export async function getKC1AnalysisMonthly(year: number) {
  const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, label: `Tháng ${i + 1}`, error_active: 0, error_resolved: 0, warning_active: 0, warning_resolved: 0 }));

  const getCount = async (tb: string) => db.query(`SELECT MONTH(occurred_at) as month_num, COUNT(*) as count FROM ${tb} WHERE YEAR(occurred_at) = ? GROUP BY MONTH(occurred_at)`, [year]).then(r => r[0] as any[]);

  const [errA, errR, warA, warR] = await Promise.all([getCount('guidekc_alarm_new'), getCount('guidekc_alarm1_new'), getCount('guidekc_alarm2_new'), getCount('guidekc_alarm3_new')]);

  return months.map(m => {
    const find = (rows: any[]) => rows.find((r: any) => r.month_num === m.month)?.count || 0;
    return { ...m, error_active: find(errA), error_resolved: find(errR), warning_active: find(warA), warning_resolved: find(warR) };
  });
}

// 4. Phân tích Xu hướng (Trend Line)
export async function getKC1AnalysisTrend(startDateStr: string, endDateStr: string) {
  const trendData = [];
  let currentDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  
  if (currentDate > endDate) return [];
  while (currentDate <= endDate && trendData.length <= 365) {
    trendData.push({ date: `${currentDate.getDate()}/${currentDate.getMonth() + 1}`, fullDate: currentDate.toISOString().split('T')[0], error_active: 0, error_resolved: 0, warning_active: 0, warning_resolved: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const getCount = async (tb: string) => db.query(`SELECT DATE(occurred_at) as log_date, COUNT(*) as count FROM ${tb} WHERE occurred_at >= ? AND occurred_at <= ? GROUP BY DATE(occurred_at)`, [`${startDateStr} 00:00:00`, `${endDateStr} 23:59:59`]).then(r => r[0] as any[]);

  const [errA, errR, warA, warR] = await Promise.all([getCount('guidekc_alarm_new'), getCount('guidekc_alarm1_new'), getCount('guidekc_alarm2_new'), getCount('guidekc_alarm3_new')]);

  return trendData.map(day => {
    const find = (rows: any[]) => rows.find((r: any) => new Date(r.log_date).toISOString().split('T')[0] === day.fullDate)?.count || 0;
    return { ...day, error_active: find(errA), error_resolved: find(errR), warning_active: find(warA), warning_resolved: find(warR) };
  });
}