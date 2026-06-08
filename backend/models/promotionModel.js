const pool = require('../config/db');

const PromotionModel = {
  findAll: async (search, limit, offset) => {
    let query = `
      SELECT p.*, u.UserName as CreatedBy 
      FROM Promotion p
      JOIN Users u ON p.UserID = u.UserID
    `;
    let params = [];

    if (search) {
      query += ` WHERE p.Title LIKE ? OR p.Discount_Type LIKE ? OR p.Status LIKE ? OR p.Description LIKE ?`;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm, searchTerm];
    }

    query += ` ORDER BY p.CreatedAt DESC`;

    if (limit && offset !== undefined) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  countAll: async (search) => {
    let query = 'SELECT COUNT(*) as total FROM Promotion';
    let params = [];

    if (search) {
      query += ` WHERE Title LIKE ? OR Discount_Type LIKE ? OR Status LIKE ? OR Description LIKE ?`;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm, searchTerm];
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  },

  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT p.*, u.UserName as CreatedBy 
      FROM Promotion p
      JOIN Users u ON p.UserID = u.UserID
      WHERE p.PromotionID = ?
    `, [id]);
    return rows[0];
  },

  create: async (data) => {
    const { Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, UserID } = data;
    const [result] = await pool.query(
      'INSERT INTO Promotion (Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, UserID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status || 'Active', UserID]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status } = data;
    const [result] = await pool.query(
      'UPDATE Promotion SET Title=?, Description=?, Discount_Type=?, Discount_Value=?, Start_Date=?, End_Date=?, Status=? WHERE PromotionID=?',
      [Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM Promotion WHERE PromotionID = ?', [id]);
    return result.affectedRows;
  },

  getDiscountTypeCounts: async () => {
    const [rows] = await pool.query('SELECT Discount_Type, COUNT(*) as count FROM Promotion GROUP BY Discount_Type');
    return rows;
  }
};

module.exports = PromotionModel;
