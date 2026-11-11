CREATE TABLE IF NOT EXISTS portal_users (
 id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE COLLATE NOCASE,
 role TEXT NOT NULL CHECK(role IN ('admin','employee')),
 password_hash TEXT, password_salt TEXT,
 active INTEGER NOT NULL DEFAULT 1, invite_hash TEXT UNIQUE, invite_expires INTEGER,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS portal_projects (
 id TEXT PRIMARY KEY REFERENCES project_briefs(id),
 assigned_to TEXT REFERENCES portal_users(id),
 stage TEXT NOT NULL DEFAULT 'received', progress INTEGER NOT NULL DEFAULT 0 CHECK(progress BETWEEN 0 AND 100),
 due_date TEXT NOT NULL DEFAULT '', client_code_hash TEXT UNIQUE,
 updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS portal_updates (
 id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES portal_projects(id),
 author_id TEXT NOT NULL REFERENCES portal_users(id),
 stage TEXT NOT NULL, progress INTEGER NOT NULL, note TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS portal_updates_project ON portal_updates(project_id,created_at);
CREATE INDEX IF NOT EXISTS portal_projects_assignee ON portal_projects(assigned_to);
CREATE TABLE IF NOT EXISTS portal_sessions (
 token_hash TEXT PRIMARY KEY, user_id TEXT REFERENCES portal_users(id),
 project_id TEXT REFERENCES portal_projects(id), expires INTEGER NOT NULL,
 CHECK((user_id IS NOT NULL AND project_id IS NULL) OR (user_id IS NULL AND project_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS portal_sessions_expiry ON portal_sessions(expires);
CREATE TABLE IF NOT EXISTS portal_rate_limits (bucket TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires INTEGER NOT NULL);
INSERT OR IGNORE INTO portal_projects(id) SELECT id FROM project_briefs;
