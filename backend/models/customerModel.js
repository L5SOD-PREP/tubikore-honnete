const pool = require('../config/db');

const CustomerModel = {
  findAll: async (search, limit, offset) => {
    let query = `
      SELECT c.*, u.UserName as RegisteredBy 
      FROM Customer c
      JOIN Users u ON c.UserID = u.UserID
    `;
    let params = [];

    if (search) {
      query += ` WHERE c.FirstName LIKE ? OR c.LastName LIKE ? OR c.Email LIKE ? OR c.PhoneNumber LIKE ? OR c.Status LIKE ?`;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
    }

    query += ` ORDER BY c.CreatedAt DESC`;

    if (limit && offset !== undefined) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  countAll: async (search) => {
    let query = 'SELECT COUNT(*) as total FROM Customer';
    let params = [];

    if (search) {
      query += ` WHERE FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR PhoneNumber LIKE ? OR Status LIKE ?`;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  },

  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT c.*, u.UserName as RegisteredBy 
      FROM Customer c
      JOIN Users u ON c.UserID = u.UserID
      WHERE c.CustomerID = ?
    `, [id]);
    return rows[0];
  },

  create: async (data) => {
    const { FirstName, LastName, Email, PhoneNumber, Status, UserID } = data;
    const [result] = await pool.query(
      'INSERT INTO Customer (FirstName, LastName, Email, PhoneNumber, Status, UserID) VALUES (?, ?, ?, ?, ?, ?)',
      [FirstName, LastName, Email, PhoneNumber, Status || 'Active', UserID]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { FirstName, LastName, Email, PhoneNumber, Status } = data;
    const [result] = await pool.query(
      'UPDATE Customer SET FirstName=?, LastName=?, Email=?, PhoneNumber=?, Status=? WHERE CustomerID=?',
      [FirstName, LastName, Email, PhoneNumber, Status, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM Customer WHERE CustomerID = ?', [id]);
    return result.affectedRows;
  },

  getStatusCounts: async () => {
    const [rows] = await pool.query('SELECT Status, COUNT(*) as count FROM Customer GROUP BY Status');
    return rows;
  }
};

module.exports = CustomerModel;
