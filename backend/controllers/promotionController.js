const PromotionModel = require('../models/promotionModel');

const PromotionController = {
  getAll: async (req, res) => {
    try {
      const { search = '', page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const promotions = await PromotionModel.findAll(search, parseInt(limit), parseInt(offset));
      const total = await PromotionModel.countAll(search);
      
      res.json({
        data: promotions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get promotions error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getById: async (req, res) => {
    try {
      const promotion = await PromotionModel.findById(req.params.id);
      if (!promotion) {
        return res.status(404).json({ message: 'Promotion not found' });
      }
      res.json(promotion);
    } catch (error) {
      console.error('Get promotion error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  create: async (req, res) => {
    try {
      const { Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status } = req.body;

      if (!Title || !Discount_Type || Discount_Value === undefined || !Start_Date || !End_Date) {
        return res.status(400).json({ message: 'All required fields must be filled' });
      }

      if (typeof Title !== 'string' || Title.trim().length < 3 || Title.trim().length > 200) {
        return res.status(400).json({ message: 'Title must be between 3 and 200 characters' });
      }

      const validDiscountTypes = ['Free', 'Percentage', 'FLAT_RATE', 'CASHBACK', 'BUY_ONE_GET_ONE', 'Bundle', 'Amount'];
      if (!validDiscountTypes.includes(Discount_Type)) {
        return res.status(400).json({ message: 'Invalid discount type' });
      }

      if (isNaN(Discount_Value) || parseFloat(Discount_Value) < 0) {
        return res.status(400).json({ message: 'Discount value must be a valid positive number' });
      }

      if (Discount_Type !== 'Free' && parseFloat(Discount_Value) === 0) {
        return res.status(400).json({ message: 'Discount value must be greater than 0 for this discount type' });
      }

      if (Discount_Type === 'Percentage' && parseFloat(Discount_Value) > 100) {
        return res.status(400).json({ message: 'Percentage discount cannot exceed 100%' });
      }

      const startDate = new Date(Start_Date);
      const endDate = new Date(End_Date);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        return res.status(400).json({ message: 'Start date cannot be in the past' });
      }

      if (endDate < today) {
        return res.status(400).json({ message: 'End date cannot be in the past' });
      }

      if (startDate > endDate) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }

      if (Status && !['Active', 'Expired'].includes(Status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const id = await PromotionModel.create({
        Title,
        Description,
        Discount_Type,
        Discount_Value: parseFloat(Discount_Value),
        Start_Date,
        End_Date,
        Status: Status || 'Active',
        UserID: req.session.user.UserID
      });

      const promotion = await PromotionModel.findById(id);
      res.status(201).json(promotion);
    } catch (error) {
      console.error('Create promotion error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status } = req.body;

      if (!Title || !Discount_Type || Discount_Value === undefined || !Start_Date || !End_Date) {
        return res.status(400).json({ message: 'All required fields must be filled' });
      }

      if (typeof Title !== 'string' || Title.trim().length < 3 || Title.trim().length > 200) {
        return res.status(400).json({ message: 'Title must be between 3 and 200 characters' });
      }

      const validDiscountTypes = ['Free', 'Percentage', 'FLAT_RATE', 'CASHBACK', 'BUY_ONE_GET_ONE', 'Bundle', 'Amount'];
      if (!validDiscountTypes.includes(Discount_Type)) {
        return res.status(400).json({ message: 'Invalid discount type' });
      }

      if (isNaN(Discount_Value) || parseFloat(Discount_Value) < 0) {
        return res.status(400).json({ message: 'Discount value must be a valid positive number' });
      }

      if (Discount_Type !== 'Free' && parseFloat(Discount_Value) === 0) {
        return res.status(400).json({ message: 'Discount value must be greater than 0 for this discount type' });
      }

      if (Discount_Type === 'Percentage' && parseFloat(Discount_Value) > 100) {
        return res.status(400).json({ message: 'Percentage discount cannot exceed 100%' });
      }

      const startDate = new Date(Start_Date);
      const endDate = new Date(End_Date);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        return res.status(400).json({ message: 'Start date cannot be in the past' });
      }

      if (endDate < today) {
        return res.status(400).json({ message: 'End date cannot be in the past' });
      }

      if (startDate > endDate) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }

      if (Status && !['Active', 'Expired'].includes(Status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const affected = await PromotionModel.update(req.params.id, {
        Title, Description, Discount_Type,
        Discount_Value: parseFloat(Discount_Value),
        Start_Date, End_Date, Status
      });

      if (affected === 0) {
        return res.status(404).json({ message: 'Promotion not found' });
      }

      const promotion = await PromotionModel.findById(req.params.id);
      res.json(promotion);
    } catch (error) {
      console.error('Update promotion error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const affected = await PromotionModel.delete(req.params.id);
      if (affected === 0) {
        return res.status(404).json({ message: 'Promotion not found' });
      }
      res.json({ message: 'Promotion deleted successfully' });
    } catch (error) {
      console.error('Delete promotion error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getAllSimple: async (req, res) => {
    try {
      const promotions = await PromotionModel.findAll('', 1000, 0);
      res.json(promotions);
    } catch (error) {
      console.error('Get all promotions error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = PromotionController;
