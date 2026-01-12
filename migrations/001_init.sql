BEGIN; 

CREATE TABLE IF NOT EXISTS schema_migrations (
    id TEXT PRIMARY KEY, 
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
); 

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    email TEXT UNIQUE NOT NULL, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT; 
