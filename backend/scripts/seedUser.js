// Run this script after npm install to create the admin user
// Usage: node backend/scripts/seedUser.js
// This ensures the bcrypt hash is generated correctly for "admin123"

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pms',
  });

  try {
    // Check if admin user exists
    const [users] = await connection.query('SELECT * FROM Users WHERE UserName = ?', ['admin']);
    
    if (users.length > 0) {
      // Update password with correct hash
      const hash = await bcrypt.hash('admin123', 10);
      await connection.query('UPDATE Users SET Password = ? WHERE UserName = ?', [hash, 'admin']);
      console.log('✓ Admin user password updated with correct hash');
    } else {
      // Create admin user
      const hash = await bcrypt.hash('admin123', 10);
      await connection.query(
        'INSERT INTO Users (UserName, Password, Role) VALUES (?, ?, ?)',
        ['admin', hash, 'Admin']
      );
      console.log('✓ Admin user created successfully');
    }
    
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('  Role: Admin');
  } catch (err) {
    console.error('Failed to seed admin user:', err.message);
    console.log('\nMake sure MySQL is running and the PMS database exists.');
    console.log('Run: source database/schema.sql');
  } finally {
    await connection.end();
  }
}

seed();
