const pool = require('../config/db');

const PromotionVehicleModel = {
  findAll: async (search, limit, offset) => {
    let query = `
      SELECT pv.*, p.Title as PromotionTitle, p.Discount_Type, p.Discount_Value,
             v.Plate_Number, v.Brand, v.Model, v.Year
      FROM Promotion_Vehicle pv
      JOIN Promotion p ON pv.PromotionID = p.PromotionID
      JOIN Vehicle v ON pv.VehicleID = v.VehicleID
    `;
    let params = [];

    if (search) {
      query += ` WHERE p.Title LIKE ? OR v.Plate_Number LIKE ? OR v.Brand LIKE ? OR v.Model LIKE ? OR pv.Performance LIKE ?`;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
    }

    query += ` ORDER BY pv.CreatedAt DESC`;

    if (limit && offset !== undefined) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  countAll: async (search) => {
    let query = `
      SELECT COUNT(*) as total
      FROM Promotion_Vehicle pv
      JOIN Promotion p ON pv.PromotionID = p.PromotionID
      JOIN Vehicle v ON pv.VehicleID = v.VehicleID
    `;
    let params = [];

    if (search) {
      query += ` WHERE p.Title LIKE ? OR v.Plate_Number LIKE ? OR v.Brand LIKE ? OR v.Model LIKE ? OR pv.Performance LIKE ?`;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
    }

    const [rows] = await pool.query(query, params);
    return rows[0].total;
  },

  findById: async (id) => {
    const [rows] = await pool.query(`
      SELECT pv.*, p.Title as PromotionTitle, p.Discount_Type, p.Discount_Value,
             v.Plate_Number, v.Brand, v.Model, v.Year
      FROM Promotion_Vehicle pv
      JOIN Promotion p ON pv.PromotionID = p.PromotionID
      JOIN Vehicle v ON pv.VehicleID = v.VehicleID
      WHERE pv.PromotionVehicleID = ?
    `, [id]);
    return rows[0];
  },

  create: async (data) => {
    const { PromotionID, VehicleID, Performance } = data;
    const [result] = await pool.query(
      'INSERT INTO Promotion_Vehicle (PromotionID, VehicleID, Performance) VALUES (?, ?, ?)',
      [PromotionID, VehicleID, Performance || null]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { PromotionID, VehicleID, Performance } = data;
    const [result] = await pool.query(
      'UPDATE Promotion_Vehicle SET PromotionID=?, VehicleID=?, Performance=? WHERE PromotionVehicleID=?',
      [PromotionID, VehicleID, Performance, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM Promotion_Vehicle WHERE PromotionVehicleID = ?', [id]);
    return result.affectedRows;
  },

  getPromotionsByVehicle: async (vehicleId) => {
    const [rows] = await pool.query(`
      SELECT pv.*, p.Title, p.Discount_Type, p.Discount_Value, p.Start_Date, p.End_Date
      FROM Promotion_Vehicle pv
      JOIN Promotion p ON pv.PromotionID = p.PromotionID
      WHERE pv.VehicleID = ?
    `, [vehicleId]);
    return rows;
  },

  getVehiclesByPromotion: async (promotionId) => {
    const [rows] = await pool.query(`
      SELECT pv.*, v.Plate_Number, v.Brand, v.Model, v.Year, v.Vehicle_Type
      FROM Promotion_Vehicle pv
      JOIN Vehicle v ON pv.VehicleID = v.VehicleID
      WHERE pv.PromotionID = ?
    `, [promotionId]);
    return rows;
  }
};

module.exports = PromotionVehicleModel;
