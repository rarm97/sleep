BEGIN; 

CREATE TABLE IF NOT EXISTS onboarding_submitting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
    version INT NOT NULL, 
    answers_json JSONB NOT NULL, 
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(), 
    UNIQUE (user_id, version)
); 

COMMIT; 

