import { HttpError } from '../errors';
import { getPool } from './pool';
import { Person, Project, ContactMessage } from './types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Queries {
  checkConnection(): Promise<boolean>;
  getAllPeople(): Promise<Person[]>;
  addPerson(person: Person): Promise<Person>;
  getAllProjects(): Promise<Project[]>;
  addContactMessage(message: Omit<ContactMessage, 'id'>): Promise<ContactMessage>;
}

export const makeQueries = (databaseUrl: string): Queries => {
  const pool = getPool(databaseUrl);

  return {
    checkConnection: async () => {
      try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT 1 as conn_test');
        return rows[0].conn_test === 1;
      } catch {
        return false;
      }
    },
    getAllPeople: async () => {
      const [rows] = await pool.query<Person[] & RowDataPacket[]>(
        `
        SELECT name, age
        FROM people
        `,
      );
      return rows;
    },
    addPerson: async ({ name, age }) => {
        const [result] = await pool.execute<ResultSetHeader>(
            `
            INSERT INTO people (name, age)
            VALUES (?, ?)
            `,
            [name, age],
        );

        if (result.affectedRows !== 1) {
            throw new HttpError(500, 'Something went wrong');
        }
        
        return { name, age };
    },
    getAllProjects: async () => {
      const [rows] = await pool.query<Project[] & RowDataPacket[]>(
        `
        SELECT id, name, description, image_url, project_url, source_code_url, tech_used
        FROM projects
        `,
      );
      return rows;
    },
    addContactMessage: async ({ full_name, email, message }) => {
        const [result] = await pool.execute<ResultSetHeader>(
            `
            INSERT INTO messages (full_name, email, message)
            VALUES (?, ?, ?)
            `,
            [full_name, email, message],
        );

        if (result.affectedRows !== 1) {
            throw new HttpError(500, 'Something went wrong');
        }

        const insertId = result.insertId;
        const [rows] = await pool.query<ContactMessage[] & RowDataPacket[]>(
            `
            SELECT id, full_name, email, message
            FROM messages
            WHERE id = ?
            `,
            [insertId]
        );

        return rows[0];
    },
  };
};
