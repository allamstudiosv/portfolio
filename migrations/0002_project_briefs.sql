CREATE TABLE IF NOT EXISTS project_briefs (
  id TEXT PRIMARY KEY,
  lang TEXT NOT NULL,
  client TEXT NOT NULL,
  email TEXT NOT NULL,
  project TEXT NOT NULL,
  answers TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  email_status TEXT NOT NULL DEFAULT 'pending',
  notion_status TEXT NOT NULL DEFAULT 'pending',
  notion_url TEXT,
  read INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS briefs_created ON project_briefs(created_at);
CREATE INDEX IF NOT EXISTS briefs_ip ON project_briefs(ip_hash,created_at);
CREATE TABLE IF NOT EXISTS brief_sessions (token_hash TEXT PRIMARY KEY, expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS brief_login_attempts (bucket TEXT PRIMARY KEY, attempts INTEGER NOT NULL DEFAULT 0);
