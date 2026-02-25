// src/services/dashboard-service.ts
'use server'

import { db } from '@/lib/db';

export interface MachineStats {
  error_active: number;
  error_resolved: number;
  warning_active: number;
  warning_resolved: number;
}

export async function getTodayStats(machineId: 'kc1' | 'kc2'): Promise<MachineStats> {
  try {
    // Hàm helper đếm số lượng bản ghi có ngày occurred_at = ngày hiện tại
    const getCountToday = async (tableName: string) => {
      const sql = `SELECT COUNT(*) as count FROM ${tableName} WHERE DATE(occurred_at) = CURDATE()`;
      const [rows] = await db.query(sql);
      return (rows as any[])[0]?.count || 0;
    };

    if (machineId === 'kc1') {
      const [eA, eR, wA, wR] = await Promise.all([
        getCountToday('guidekc_alarm_new'),
        getCountToday('guidekc_alarm1_new'),
        getCountToday('guidekc_alarm2_new'),
        getCountToday('guidekc_alarm3_new'),
      ]);
      return { error_active: eA, error_resolved: eR, warning_active: wA, warning_resolved: wR };
    } else {
      const [eA, eR, wA, wR] = await Promise.all([
        getCountToday('guidekc_alarm_new4'),
        getCountToday('guidekc_alarm_new5'),
        getCountToday('guidekc_alarm_new6'),
        getCountToday('guidekc_alarm_new7'),
      ]);
      return { error_active: eA, error_resolved: eR, warning_active: wA, warning_resolved: wR };
    }
  } catch (error) {
    console.error(`Lỗi lấy dữ liệu dashboard cho ${machineId}:`, error);
    return { error_active: 0, error_resolved: 0, warning_active: 0, warning_resolved: 0 };
  }
}