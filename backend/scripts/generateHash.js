// Run this script to generate the correct bcrypt hash for "admin123"
// Usage: node backend/scripts/generateHash.js
// Then update database/seed.sql with the output hash

const bcrypt = require('bcryptjs');

async function generateHash() {
  const hash = await bcrypt.hash('admin123', 10);
  console.log('Hash for admin123:', hash);
  console.log('\nUpdate seed.sql with this hash:');
  console.log(`INSERT INTO Users (UserName, Password, Role) VALUES\n('admin', '${hash}', 'Admin');`);
}

generateHash().catch(console.error);
