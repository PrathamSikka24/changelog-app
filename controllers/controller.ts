import { Client } from 'pg';
// Adjust the readmePath according to your file structure
// Adjust the readmePath according to your file structure
import type { ChangelogRequestBody } from './interfaces';

const client = new Client({
    user: 'root',
    host: 'localhost',
    database: 'changelog',
    password: 'your_password',
    port: 26257,
});

client.connect()
    .then(() => console.log("Connected to CockroachDB"))
    .catch(e => console.error("Connection error", e));

export async function getChangelogs() {
    try {
        const res = await client.query('SELECT * FROM changelog ORDER BY id');
        return { data: res.rows, error: null };
    } catch (err) {
        console.error('Error fetching changelogs:', err instanceof Error ? err.message : 'An unexpected error occurred');
        return { data: null, error: err };
    }
}

export async function getChangelogById(id: any) {
    try {
        const res = await client.query('SELECT * FROM changelog WHERE id = $1', [id]);
        return { data: res.rows[0], error: null };
    } catch (err) {
        console.error('Error fetching changelog by ID:', err instanceof Error ? err.message : 'An unexpected error occurred');
        return { data: null, error: err };
    }
}

export async function insertChangelog({readmePath, version, date, author }: ChangelogRequestBody) {
    // Update the query to include the additional fields
    const query = 'INSERT INTO changelog (readmePath, version, date, author) VALUES ($1, $2, $3, $4) RETURNING *';
    
    try {
        // Update the query parameters to include the new fields
        const res = await client.query(query, [readmePath, version, date, author]);
        console.log('Insert successful:', res.rows[0]);
        return { data: res.rows[0], error: null };
    } catch (err) {
        console.error('Insert error:', err instanceof Error ? err.message : 'An unexpected error occurred');
        return { data: null, error: err };
    }
}
export class ChangeLogService {
    private dataSource;
  
    constructor(dataSource: any) {
      this.dataSource = dataSource;
    }
  
    async getChangelogs() {
      return await this.dataSource.getChangeLogs();
    }
  }