// src/lib/db.ts
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: '192.168.122.10', // IP server của bạn
  port: 3307,
  user: 'root',
  password: 'Spc123@@@',
  database: 'Video_Cobot',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});