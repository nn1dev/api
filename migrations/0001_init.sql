CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT UNIQUE NOT NULL,
    confirmed INTEGER NOT NULL CHECK (confirmed IN (0, 1)),
    confirmation_token TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY NOT NULL,
    event_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    confirmed INTEGER NOT NULL CHECK (confirmed IN (0, 1)),
    confirmation_token TEXT,
    subscribe INTEGER NOT NULL CHECK (confirmed IN (0, 1)),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
