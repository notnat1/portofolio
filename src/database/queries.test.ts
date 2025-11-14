import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getConfig } from '../config';
import { applyMigrations } from './migrate';
import { getPool } from './pool';
import { Queries, makeQueries } from './queries';
import { RowDataPacket } from 'mysql2';

describe('queries', () => {
  const config = getConfig('TEST_');
  let queries: Queries;

  // migrate up and create app before all tests
  beforeAll(async () => {
    await applyMigrations(config.databaseUrl);
    queries = makeQueries(config.databaseUrl);
  });

  // empty database before each test
  beforeEach(async () => {
    const pool = getPool(config.databaseUrl);
    await pool.query('DELETE FROM people');
    await pool.query('DELETE FROM projects');
    await pool.query('DELETE FROM messages');
  });

  // close database connection after all tests
  afterAll(async () => {
    const pool = getPool(config.databaseUrl);
    await pool.query('DROP TABLE people');
    await pool.query('DROP TABLE projects');
    await pool.query('DROP TABLE messages');
    await pool.query('DROP TABLE migrations');
    await getPool(config.databaseUrl).end();
  });

  describe('.checkConnection', () => {
    it('returns true when database connection is successful', async () => {
      const result = await queries.checkConnection();
      expect(result).toBe(true);
    });

    it('returns false when database query throws an error', async () => {
      vi.spyOn(getPool(config.databaseUrl), 'query').mockImplementationOnce(() => {
        throw new Error();
      });

      const result = await queries.checkConnection();
      expect(result).toBe(false);
    });

    it('returns false when query returns unexpected results', async () => {
      vi.spyOn(getPool(config.databaseUrl), 'query').mockImplementationOnce(async () => [
        [{ conn_test: 2 }] as RowDataPacket[],
        [],
      ]);

      const result = await queries.checkConnection();
      expect(result).toBe(false);
    });

    it('returns false when query returns empty results', async () => {
      vi.spyOn(getPool(config.databaseUrl), 'query').mockImplementationOnce(async () => [
        [] as RowDataPacket[],
        [],
      ]);

      const result = await queries.checkConnection();
      expect(result).toBe(false);
    });
  });

  describe('.getAllPeople and .addPerson', () => {
    it('gets all people and adds to the database', async () => {
      const people1 = await queries.getAllPeople();
      expect(people1).toHaveLength(0);

      await queries.addPerson({ name: 'Joe', age: 20 });
      await queries.addPerson({ name: 'John', age: 21 });

      const people2 = await queries.getAllPeople();
      expect(people2).toHaveLength(2);
      expect(people2).toEqual([
        { name: 'Joe', age: 20 },
        { name: 'John', age: 21 },
      ]);
    });
  });

  describe('.getAllProjects', () => {
    it('gets all projects', async () => {
        const projects = await queries.getAllProjects();
        expect(projects).toHaveLength(0);
    });
  });

  describe('.addContactMessage', () => {
    it('adds a contact message', async () => {
        const message = {
            full_name: 'Test User',
            email: 'test@example.com',
            message: 'This is a test message',
        };
        const insertedMessage = await queries.addContactMessage(message);
        expect(insertedMessage.full_name).toBe(message.full_name);
        expect(insertedMessage.email).toBe(message.email);
        expect(insertedMessage.message).toBe(message.message);
    });
  });
});
