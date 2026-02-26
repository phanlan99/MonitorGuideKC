// src/lib/db.ts
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: '192.168.122.10',
  port: 3307,
  user: 'root',
  password: 'Spc123@@@',
  database: 'Video_Cobot',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+07:00', // <--- THÊM: Ép MySQL hiểu query đang gọi từ VN
  dateStrings: true,  // <--- THÊM: Trả về đúng chuỗi text (14:07) từ DB thay vì ép kiểu Object Date sai lệch
});