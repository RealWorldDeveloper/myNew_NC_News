const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'dev';
const config = {};
require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});
if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}
if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

module.exports = new Pool(config);
