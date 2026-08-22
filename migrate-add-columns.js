const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const sql = `
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS username VARCHAR(30),
  ADD COLUMN IF NOT EXISTS security_question VARCHAR(200),
  ADD COLUMN IF NOT EXISTS security_answer TEXT,
  ADD COLUMN IF NOT EXISTS reset_token TEXT,
  ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMPTZ;

ALTER TABLE trips
  ADD COLUMN IF NOT EXISTS cover_photo_url TEXT;

-- Create unique index only if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS users_username_key ON users(username) WHERE username IS NOT NULL;
`;

pool.query(sql, (err, res) => {
  if (err) {
    console.error('Migration error:', err.message);
  } else {
    console.log('✅ Columns added successfully!');
  }
  pool.end();
});
