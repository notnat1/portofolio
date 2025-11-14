import fs from 'fs/promises';
import path from 'path';
import { getPool } from './pool';
import { RowDataPacket } from 'mysql2';

export async function applyMigrations(databaseUrl: string) {
  const pool = getPool(databaseUrl);
  const migrationsDir = path.resolve(__dirname, '../../migrations');

  // 1. Create migrations table if it doesn't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Get all applied migrations
  const [appliedMigrations] = await pool.query<RowDataPacket[]>(`
    SELECT name FROM migrations
  `);
  const appliedMigrationNames = appliedMigrations.map((row) => row.name);

  // 3. Get all migration files
  const migrationFiles = await fs.readdir(migrationsDir);

  // 4. Filter out already applied migrations and apply new ones
  for (const file of migrationFiles) {
    if (!appliedMigrationNames.includes(file)) {
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, 'utf-8');
      
      // Split SQL file into individual statements
      const statements = sql.split(';').filter(statement => statement.trim() !== '');

      // Execute each statement
      for (const statement of statements) {
        await pool.query(statement);
      }

      // 5. Add migration to migrations table
      await pool.query('INSERT INTO migrations (name) VALUES (?)', [file]);
      console.log(`Applied migration: ${file}`);
    }
  }
}
