const pool = require('../config/db');

const ReportController = {
  getReport: async (req, res) => {
    try {
      const { search = '' } = req.query;

      let query = `
        SELECT 
          v.Brand,
          v.Model,
          v.Plate_Number,
          p.Title as PromotionTitle,
          p.Discount_Value,
          p.Discount_Type,
          pv.Performance
        FROM Promotion_Vehicle pv
        JOIN Promotion p ON pv.PromotionID = p.PromotionID
        JOIN Vehicle v ON pv.VehicleID = v.VehicleID
      `;
      let params = [];

      if (search) {
        query += ` WHERE (v.Brand LIKE ? OR v.Model LIKE ? OR v.Plate_Number LIKE ? OR p.Title LIKE ?)`;
        const searchTerm = `%${search}%`;
        params = [searchTerm, searchTerm, searchTerm, searchTerm];
      }

      query += ` ORDER BY pv.CreatedAt DESC`;

      const [rows] = await pool.query(query, params);

      // Get all customers for the report (for frontend filtering)
      const [customers] = await pool.query(`
        SELECT CustomerID, CONCAT(FirstName, ' ', LastName) as CustomerName
        FROM Customer
      `);

      // Add a default customer reference (since there's no FK between customers and assignments)
      const data = rows.map(row => ({
        ...row,
        CustomerName: '-' // No direct customer link in schema
      }));

      res.json({
        data,
        customers
      });
    } catch (error) {
      console.error('Report error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getFullReport: async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          v.Plate_Number,
          v.Brand,
          v.Model,
          v.Year,
          v.Vehicle_Type,
          p.Title as PromotionTitle,
          p.Discount_Type,
          p.Discount_Value,
          p.Start_Date,
          p.End_Date,
          pv.Performance,
          pv.CreatedAt as AssignmentDate
        FROM Promotion_Vehicle pv
        JOIN Promotion p ON pv.PromotionID = p.PromotionID
        JOIN Vehicle v ON pv.VehicleID = v.VehicleID
        ORDER BY pv.CreatedAt DESC
      `);

      const data = rows.map(row => ({
        ...row,
        CustomerName: '-'
      }));

      res.json(data);
    } catch (error) {
      console.error('Full report error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = ReportController;
