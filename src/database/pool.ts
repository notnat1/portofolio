import mysql from 'mysql2/promise';

let _pool: mysql.Pool | null = null;

export function getPool(databaseUrl: string): mysql.Pool {
  if (!_pool) {
    _pool = mysql.createPool(databaseUrl);
  }
  return _pool;
}
