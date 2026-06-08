const VehicleModel = require('../models/vehicleModel');

const VehicleController = {
  getAll: async (req, res) => {
    try {
      const { search = '', page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const vehicles = await VehicleModel.findAll(
        search,
        parseInt(limit),
        parseInt(offset)
      );

      const total = await VehicleModel.countAll(search);

      res.json({
        data: vehicles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get vehicles error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getById: async (req, res) => {
    try {
      const vehicle = await VehicleModel.findById(req.params.id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      res.json(vehicle);
    } catch (error) {
      console.error('Get vehicle error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  create: async (req, res) => {
    try {
      const {
        Plate_Number,
        Brand,
        Model,
        Year,
        Vehicle_Type,
        Purchase_Price,
        Status
      } = req.body;

      if (
        !Plate_Number ||
        !Brand ||
        !Model ||
        !Year ||
        !Vehicle_Type ||
        !Purchase_Price
      ) {
        return res.status(400).json({
          message: 'All required fields must be filled'
        });
      }

      if (typeof Plate_Number !== 'string' || Plate_Number.trim().length < 2 || Plate_Number.trim().length > 50) {
        return res.status(400).json({ message: 'Plate number must be between 2 and 50 characters' });
      }

      if (!/^[a-zA-Z0-9\s\-]+$/.test(Plate_Number.trim())) {
        return res.status(400).json({ message: 'Plate number can only contain letters, numbers, spaces, and hyphens' });
      }

      if (typeof Brand !== 'string' || Brand.trim().length < 2 || Brand.trim().length > 100) {
        return res.status(400).json({ message: 'Brand must be between 2 and 100 characters' });
      }

      if (!/^[a-zA-Z\s]+$/.test(Brand.trim())) {
        return res.status(400).json({ message: 'Brand must only contain letters and spaces' });
      }

      if (typeof Model !== 'string' || Model.trim().length < 1 || Model.trim().length > 100) {
        return res.status(400).json({ message: 'Model must be between 1 and 100 characters' });
      }

      if (isNaN(Year) || !Number.isInteger(Number(Year)) || Year < 1900 || Year > 2100) {
        return res.status(400).json({ message: 'Year must be a valid whole number between 1900 and 2100' });
      }

      if (isNaN(Purchase_Price) || Number(Purchase_Price) <= 0) {
        return res.status(400).json({ message: 'Purchase price must be a valid positive number' });
      }

      if (typeof Vehicle_Type !== 'string' || !Vehicle_Type.trim()) {
        return res.status(400).json({ message: 'Vehicle type is required' });
      }

      if (Number(Purchase_Price) > 999999999) {
        return res.status(400).json({ message: 'Purchase price exceeds maximum allowed' });
      }

      if (Status && !['Available', 'Rented', 'Maintenance'].includes(Status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const id = await VehicleModel.create({
        Plate_Number,
        Brand,
        Model,
        Year: parseInt(Year),
        Vehicle_Type,
        Purchase_Price: parseFloat(Purchase_Price),
        Status: Status || 'Available',
        UserID: req.session.user.UserID
      });

      const vehicle = await VehicleModel.findById(id);

      res.status(201).json(vehicle);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          message: 'Plate number already exists'
        });
      }

      console.error('Create vehicle error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const {
        Plate_Number,
        Brand,
        Model,
        Year,
        Vehicle_Type,
        Purchase_Price,
        Status
      } = req.body;

      if (
        !Plate_Number ||
        !Brand ||
        !Model ||
        !Year ||
        !Vehicle_Type ||
        !Purchase_Price
      ) {
        return res.status(400).json({
          message: 'All required fields must be filled'
        });
      }

      if (typeof Plate_Number !== 'string' || Plate_Number.trim().length < 2 || Plate_Number.trim().length > 50) {
        return res.status(400).json({ message: 'Plate number must be between 2 and 50 characters' });
      }

      if (!/^[a-zA-Z0-9\s\-]+$/.test(Plate_Number.trim())) {
        return res.status(400).json({ message: 'Plate number can only contain letters, numbers, spaces, and hyphens' });
      }

      if (typeof Brand !== 'string' || Brand.trim().length < 2 || Brand.trim().length > 100) {
        return res.status(400).json({ message: 'Brand must be between 2 and 100 characters' });
      }

      if (!/^[a-zA-Z\s]+$/.test(Brand.trim())) {
        return res.status(400).json({ message: 'Brand must only contain letters and spaces' });
      }

      if (typeof Model !== 'string' || Model.trim().length < 1 || Model.trim().length > 100) {
        return res.status(400).json({ message: 'Model must be between 1 and 100 characters' });
      }

      if (isNaN(Year) || !Number.isInteger(Number(Year)) || Year < 1900 || Year > 2100) {
        return res.status(400).json({ message: 'Year must be a valid whole number between 1900 and 2100' });
      }

      if (isNaN(Purchase_Price) || Number(Purchase_Price) <= 0) {
        return res.status(400).json({ message: 'Purchase price must be a valid positive number' });
      }

      if (typeof Vehicle_Type !== 'string' || !Vehicle_Type.trim()) {
        return res.status(400).json({ message: 'Vehicle type is required' });
      }

      if (Number(Purchase_Price) > 999999999) {
        return res.status(400).json({ message: 'Purchase price exceeds maximum allowed' });
      }

      if (Status && !['Available', 'Rented', 'Maintenance'].includes(Status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const affected = await VehicleModel.update(req.params.id, {
        Plate_Number,
        Brand,
        Model,
        Year: parseInt(Year),
        Vehicle_Type,
        Purchase_Price: parseFloat(Purchase_Price),
        Status
      });

      if (affected === 0) {
        return res.status(404).json({
          message: 'Vehicle not found'
        });
      }

      const vehicle = await VehicleModel.findById(req.params.id);

      res.json(vehicle);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          message: 'Plate number already exists'
        });
      }

      console.error('Update vehicle error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const affected = await VehicleModel.delete(req.params.id);

      if (affected === 0) {
        return res.status(404).json({
          message: 'Vehicle not found'
        });
      }

      res.json({
        message: 'Vehicle deleted successfully'
      });
    } catch (error) {
      console.error('Delete vehicle error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getAllSimple: async (req, res) => {
    try {
      const vehicles = await VehicleModel.findAll('', 1000, 0);
      res.json(vehicles);
    } catch (error) {
      console.error('Get all vehicles error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = VehicleController;