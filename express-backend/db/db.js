const { Pool } = require('pg');

const pool = new Pool({
  user: 'codez',
  host: 'localhost',
  database: 'demodb',
  password: 'code',
  port: 5432,
});

module.exports = pool;
