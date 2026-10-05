-- Contact form storage. Already applied to the production database.
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  country TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  read INTEGER NOT NULL DEFAULT 0
);
