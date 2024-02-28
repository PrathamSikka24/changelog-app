import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createChangelogTable() {
  const client = await pool.connect();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS changelog (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        readmePath TEXT NOT NULL,
        version VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL
      );
    `;
    await client.query(query);
    console.log("Changelog table created or already exists.");
  } catch (error) {
    console.error("Could not create changelog table:", error);
  } finally {
    client.release();
  }
}

const data = [
  {
    readmePath: "../../content/employee-app.md",
    date: "2024-01-19",
    version: "v 1.0.3",
    author: "Devzero-Inc",
  },
  {
    readmePath: "../../content/photo-app.md",
    date: "2024-01-29",
    version: "v 1.0.2",
    author: "Devzero-Inc",
  },
  {
    readmePath: "../../content/roadmap-app.md",
    date: "2024-02-02",
    version: "v 1.2.1",
    author: "Devzero-Inc",
  },
];

export async function seedDatabase() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const { readmePath, date, version, author } of data) {
      await client.query(
        "INSERT INTO changelog (readmePath, date, version, author) VALUES ($1, $2, $3, $4)",
        [readmePath, date, version, author]
      );

      console.log("Inserted:", readmePath);
    }

    await client.query("COMMIT");
    console.log("All data successfully inserted.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Failed to insert seed data:", err);
  } finally {
    client.release();
  }
}

async function main() {
  await createChangelogTable(); // Ensure the table exists before seeding
  await seedDatabase(); // Then seed the database
  pool.end(); // Close the pool at the end of the script
}

main().catch(console.error);
