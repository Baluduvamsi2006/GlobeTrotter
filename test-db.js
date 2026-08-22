const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB Error:', err);
  } else {
    console.log('DB Time:', res.rows[0]);
  }
  pool.end();
});
