const path = require('path');
const fs   = require('fs');

const TEST_DB = path.join(__dirname, '..', 'etoh_test.db');

// Set test env BEFORE any module is required
process.env.NODE_ENV  = 'test';
process.env.DB_PATH   = TEST_DB;
process.env.JWT_SECRET = 'test_secret_key';
process.env.ADMIN_PASSWORD = 'test_admin_pass';

function cleanTestDb() {
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
}

module.exports = { TEST_DB, cleanTestDb };
