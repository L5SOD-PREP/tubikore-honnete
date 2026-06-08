const pool = require('../config/db');

const VehicleModel = {
  findAll: async (search, limit, offset) => {
    let query = `
      SELECT v.*, u.UserName as RegisteredBy 
      FROM Vehicle v
      JOIN Users u ON v.UserID = u.UserID
    `;
    let params = [];

    if (search) {
      query += ` WHERE v.Plate_Number LIKE ? OR v.Brand LIKE ? OR v.Model LIKE ? OR v.Vehicle_Type LIKE ? OR v.Status LIKE ?`;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
    }

    query += ` ORDER BY v.CreatedAt DESC`;

    if (limit && offset !== undefined) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  countAll: async (search) => {
    let query = 'SELECT COUNT(*) as total FROM Vehicle';
    let params = [];

    if (search) {
      query += ` WHERE Plate_Number LIKE ? OR Brand LIKE ? OR Model LIKE ? OR Vehicle_Type LIKE ? OR Status LIKE ?`;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  },

  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT v.*, u.UserName as RegisteredBy 
      FROM Vehicle v
      JOIN Users u ON v.UserID = u.UserID
      WHERE v.VehicleID = ?
    `, [id]);
    return rows[0];
  },

  create: async (data) => {
    const { Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, UserID } = data;
    const [result] = await pool.query(
      'INSERT INTO Vehicle (Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, UserID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status || 'Available', UserID]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status } = data;
    const [result] = await pool.query(
      'UPDATE Vehicle SET Plate_Number=?, Brand=?, Model=?, Year=?, Vehicle_Type=?, Purchase_Price=?, Status=? WHERE VehicleID=?',
      [Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM Vehicle WHERE VehicleID = ?', [id]);
    return result.affectedRows;
  },

  getStatusCounts: async () => {
    const [rows] = await pool.query('SELECT Status, COUNT(*) as count FROM Vehicle GROUP BY Status');
    return rows;
  }
};

module.exports = VehicleModel;
