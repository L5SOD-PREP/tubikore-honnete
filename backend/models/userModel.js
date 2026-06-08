const pool = require('../config/db');

const UserModel = {
  findByUsername: async (username) => {
    const [rows] = await pool.query('SELECT * FROM Users WHERE UserName = ?', [username]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT UserID, UserName, Role FROM Users WHERE UserID = ?', [id]);
    return rows[0];
  },

  findAll: async () => {
    const [rows] = await pool.query('SELECT UserID, UserName, Role, CreatedAt FROM Users ORDER BY CreatedAt DESC');
    return rows;
  },

  create: async (data) => {
    const { UserName, Password, Role } = data;
    const [result] = await pool.query(
      'INSERT INTO Users (UserName, Password, Role) VALUES (?, ?, ?)',
      [UserName, Password, Role || 'Admin']
    );
    return result.insertId;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM Users WHERE UserID = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = UserModel;
