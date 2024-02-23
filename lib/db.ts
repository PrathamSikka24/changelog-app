import {  Pool } from 'pg';
// Importing dotenv to use environment variables if needed
import dotenv from 'dotenv';

import Bao from "baojs";
import fs from "fs";
import path from "path";
dotenv.config();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Since you're using TypeScript, use `export` instead of `module.exports`
export { pool };


const app = new Bao();
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function initializeDatabase() {
    const client = await dbPool.connect();
    try {
        // Load your SQL script for table creation
        const sql = fs.readFileSync(path.join(__dirname, "init_db.sql"), "utf8");
        await client.query(sql);
        console.log("Database initialized successfully.");
    } catch (err) {
        console.error("Failed to initialize database:", err);
    } finally {
        client.release();
    }
}

// Add database initialization at the start of your application
