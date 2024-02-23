CREATE TABLE IF NOT EXISTS changelog (
  id SERIAL PRIMARY KEY,
  readmePath TEXT NOT NULL,
  version TEXT NOT NULL,
  date TEXT NOT NULL,
  author TEXT NOT NULL
);

