const PromotionVehicleModel = require('../models/promotionVehicleModel');

const PromotionVehicleController = {
  getAll: async (req, res) => {
    try {
      const { search = '', page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const assignments = await PromotionVehicleModel.findAll(search, parseInt(limit), parseInt(offset));
      const total = await PromotionVehicleModel.countAll(search);
      
      res.json({
        data: assignments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get assignments error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getById: async (req, res) => {
    try {
      const assignment = await PromotionVehicleModel.findById(req.params.id);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
      res.json(assignment);
    } catch (error) {
      console.error('Get assignment error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  create: async (req, res) => {
    try {
      const { PromotionID, VehicleID, Performance } = req.body;

      if (!PromotionID || !VehicleID) {
        return res.status(400).json({ message: 'Promotion and Vehicle are required' });
      }

      const promId = parseInt(PromotionID);
      const vehId = parseInt(VehicleID);

      if (isNaN(promId) || promId < 1) {
        return res.status(400).json({ message: 'Invalid promotion ID' });
      }

      if (isNaN(vehId) || vehId < 1) {
        return res.status(400).json({ message: 'Invalid vehicle ID' });
      }

      if (Performance && (typeof Performance !== 'string' || Performance.length > 255)) {
        return res.status(400).json({ message: 'Performance notes must be under 255 characters' });
      }

      const id = await PromotionVehicleModel.create({
        PromotionID, VehicleID, Performance
      });

      const assignment = await PromotionVehicleModel.findById(id);
      res.status(201).json(assignment);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'This vehicle is already assigned to this promotion' });
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ message: 'Invalid promotion or vehicle ID' });
      }
      console.error('Create assignment error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { PromotionID, VehicleID, Performance } = req.body;

      if (!PromotionID || !VehicleID) {
        return res.status(400).json({ message: 'Promotion and Vehicle are required' });
      }

      const promId = parseInt(PromotionID);
      const vehId = parseInt(VehicleID);

      if (isNaN(promId) || promId < 1) {
        return res.status(400).json({ message: 'Invalid promotion ID' });
      }

      if (isNaN(vehId) || vehId < 1) {
        return res.status(400).json({ message: 'Invalid vehicle ID' });
      }

      if (Performance && (typeof Performance !== 'string' || Performance.length > 255)) {
        return res.status(400).json({ message: 'Performance notes must be under 255 characters' });
      }

      const affected = await PromotionVehicleModel.update(req.params.id, {
        PromotionID, VehicleID, Performance
      });

      if (affected === 0) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      const assignment = await PromotionVehicleModel.findById(req.params.id);
      res.json(assignment);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'This vehicle is already assigned to this promotion' });
      }
      console.error('Update assignment error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const affected = await PromotionVehicleModel.delete(req.params.id);
      if (affected === 0) {
        return res.status(404).json({ message: 'Assignment not found' });
      }
      res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
      console.error('Delete assignment error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = PromotionVehicleController;
