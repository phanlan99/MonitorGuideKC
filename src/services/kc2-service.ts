// src/services/kc2-service.ts
'use server'

import { db } from '@/lib/db';

// --- CÁC INTERFACE ĐỊNH NGHĨA KIỂU DỮ LIỆU ---

// 1. Kiểu dữ liệu cơ bản cho Log (dùng cho Dashboard)
export interface LogItem {
  id: number;
  error_code: number;
  error_content: string;
  occurred_at: string; // Chuyển Date sang string để tránh lỗi serialize của Next.js
  status: 'active' | 'resolved';
}

// 2. Kiểu dữ liệu bộ lọc cho trang Lịch sử (History)
export interface HistoryFilter {
  startDate: string; // Dạng từ input datetime-local: "YYYY-MM-DDTHH:mm"
  endDate: string;   // Dạng từ input datetime-local: "YYYY-MM-DDTHH:mm"
  errorCode?: string;
  content?: string;
  status: 'all' | 'active' | 'resolved';
  type: 'all' | 'error' | 'warning';
}

// 3. Kiểu dữ liệu trả về cho trang Lịch sử (mở rộng thêm cột 'type')
export interface HistoryItem extends LogItem {
  type: 'error' | 'warning';
}

// --- CÁC FUNCTION XỬ LÝ DATABASE ---

/**
 * Hàm lấy logs mới nhất cho Dashboard (Giới hạn 20 dòng)
 */
export async function getKC2Logs(type: 'error' | 'warning'): Promise<LogItem[]> {
  try {
    let query = '';

    if (type === 'error') {
      // Logic lấy LỖI (Bảng 4 và 5)
      query = `
        (SELECT id, error_code, error_content, occurred_at, 'active' as status FROM guidekc_alarm4)
        UNION ALL
        (SELECT id, error_code, error_content, occurred_at, 'resolved' as status FROM guidekc_alarm5)
        ORDER BY occurred_at DESC
        LIMIT 20
      `;
    } else {
      // Logic lấy CẢNH BÁO (Bảng 6 và 7)
      query = `
        (SELECT id, error_code, error_content, occurred_at, 'active' as status FROM guidekc_alarm6)
        UNION ALL
        (SELECT id, error_code, error_content, occurred_at, 'resolved' as status FROM guidekc_alarm7)
        ORDER BY occurred_at DESC
        LIMIT 20
      `;
    }

    const [rows] = await db.query(query);
    
    // Convert Date object sang String ISO
    const data = (rows as any[]).map(row => ({
      ...row,
      occurred_at: new Date(row.occurred_at).toISOString()
    }));

    return data as LogItem[];

  } catch (error) {
    console.error('Lỗi lấy dữ liệu KC2 Dashboard:', error);
    return [];
  }
}

/**
 * Hàm tìm kiếm lịch sử log với bộ lọc chi tiết
 */
export async function searchKC2History(filter: HistoryFilter): Promise<HistoryItem[]> {
  try {
    // 1. Xây dựng các câu query con dựa trên loại (type) và trạng thái (status)
    const queries: string[] = [];
    
    // Nếu chọn Type là All hoặc Error
    if (filter.type === 'all' || filter.type === 'error') {
      if (filter.status === 'all' || filter.status === 'active') {
        queries.push(`SELECT id, error_code, error_content, occurred_at, 'active' as status, 'error' as type FROM guidekc_alarm4`);
      }
      if (filter.status === 'all' || filter.status === 'resolved') {
        queries.push(`SELECT id, error_code, error_content, occurred_at, 'resolved' as status, 'error' as type FROM guidekc_alarm5`);
      }
    }

    // Nếu chọn Type là All hoặc Warning
    if (filter.type === 'all' || filter.type === 'warning') {
      if (filter.status === 'all' || filter.status === 'active') {
        queries.push(`SELECT id, error_code, error_content, occurred_at, 'active' as status, 'warning' as type FROM guidekc_alarm6`);
      }
      if (filter.status === 'all' || filter.status === 'resolved') {
        queries.push(`SELECT id, error_code, error_content, occurred_at, 'resolved' as status, 'warning' as type FROM guidekc_alarm7`);
      }
    }

    // Nếu không có bảng nào được chọn, trả về rỗng ngay
    if (queries.length === 0) return [];

    // Gộp các bảng lại bằng UNION ALL
    const unionQuery = queries.join(' UNION ALL ');
    let finalQuery = `SELECT * FROM (${unionQuery}) as t WHERE 1=1`;
    const params: any[] = [];

    // 2. Áp dụng bộ lọc THỜI GIAN (Logic cập nhật theo hướng dẫn)
    // Input HTML trả về "YYYY-MM-DDTHH:mm", MySQL cần "YYYY-MM-DD HH:mm:ss"
    
    if (filter.startDate) {
      finalQuery += ` AND occurred_at >= ?`;
      // Replace 'T' bằng khoảng trắng và thêm giây 00
      params.push(filter.startDate.replace('T', ' ') + ':00'); 
    }
    
    if (filter.endDate) {
      finalQuery += ` AND occurred_at <= ?`;
      // Replace 'T' bằng khoảng trắng và thêm giây 59 để lấy hết phút đó
      params.push(filter.endDate.replace('T', ' ') + ':59'); 
    }

    // 3. Các bộ lọc khác (Mã lỗi, Nội dung)
    if (filter.errorCode) {
      finalQuery += ` AND error_code = ?`;
      params.push(filter.errorCode);
    }
    
    if (filter.content) {
      finalQuery += ` AND error_content LIKE ?`;
      params.push(`%${filter.content}%`);
    }

    // 4. Sắp xếp và giới hạn kết quả
    finalQuery += ` ORDER BY occurred_at DESC LIMIT 500`;

    // 5. Thực thi query
    const [rows] = await db.query(finalQuery, params);

    // Convert Date object sang String ISO
    const data = (rows as any[]).map(row => ({
      ...row,
      occurred_at: new Date(row.occurred_at).toISOString()
    }));

    return data as HistoryItem[];

  } catch (error) {
    console.error('Lỗi tìm kiếm lịch sử KC2:', error);
    return [];
  }
}