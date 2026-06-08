const CustomerModel = require('../models/customerModel');

const CustomerController = {
  getAll: async (req, res) => {
    try {
      const { search = '', page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      
      const customers = await CustomerModel.findAll(search, parseInt(limit), parseInt(offset));
      const total = await CustomerModel.countAll(search);
      
      res.json({
        data: customers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get customers error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getById: async (req, res) => {
    try {
      const customer = await CustomerModel.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      console.error('Get customer error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  create: async (req, res) => {
    try {
      const { FirstName, LastName, Email, PhoneNumber, Status } = req.body;

      if (!FirstName || !LastName || !Email || !PhoneNumber) {
        return res.status(400).json({ message: 'All required fields must be filled' });
      }

      if (typeof FirstName !== 'string' || FirstName.trim().length < 2 || FirstName.trim().length > 100) {
        return res.status(400).json({ message: 'First name must be between 2 and 100 characters' });
      }

      if (!/^[a-zA-Z\s]+$/.test(FirstName.trim())) {
        return res.status(400).json({ message: 'First name must only contain letters and spaces' });
      }

      if (typeof LastName !== 'string' || LastName.trim().length < 2 || LastName.trim().length > 100) {
        return res.status(400).json({ message: 'Last name must be between 2 and 100 characters' });
      }

      if (!/^[a-zA-Z\s]+$/.test(LastName.trim())) {
        return res.status(400).json({ message: 'Last name must only contain letters and spaces' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(Email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      if (typeof Email !== 'string' || Email.length > 150) {
        return res.status(400).json({ message: 'Email is too long' });
      }

      if (!/^[\d\s+\-()]{7,20}$/.test(PhoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format. Use 7-20 digits, spaces, +, -, or ()' });
      }

      if (Status && !['Active', 'Inactive', 'Blocked'].includes(Status)) {
        return res.status(400).json({ message: 'Invalid status value. Must be Active, Inactive, or Blocked' });
      }

      const id = await CustomerModel.create({
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        Status: Status || 'Active',
        UserID: req.session.user.UserID
      });

      const customer = await CustomerModel.findById(id);
      res.status(201).json(customer);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      console.error('Create customer error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { FirstName, LastName, Email, PhoneNumber, Status } = req.body;

      if (!FirstName || !LastName || !Email || !PhoneNumber) {
        return res.status(400).json({ message: 'All required fields must be filled' });
      }

      if (typeof FirstName !== 'string' || FirstName.trim().length < 2 || FirstName.trim().length > 100) {
        return res.status(400).json({ message: 'First name must be between 2 and 100 characters' });
      }

      if (!/^[a-zA-Z\s]+$/.test(FirstName.trim())) {
        return res.status(400).json({ message: 'First name must only contain letters and spaces' });
      }

      if (typeof LastName !== 'string' || LastName.trim().length < 2 || LastName.trim().length > 100) {
        return res.status(400).json({ message: 'Last name must be between 2 and 100 characters' });
      }

      if (!/^[a-zA-Z\s]+$/.test(LastName.trim())) {
        return res.status(400).json({ message: 'Last name must only contain letters and spaces' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(Email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      if (typeof Email !== 'string' || Email.length > 150) {
        return res.status(400).json({ message: 'Email is too long' });
      }

      if (!/^[\d\s+\-()]{7,20}$/.test(PhoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }

      if (Status && !['Active', 'Inactive', 'Blocked'].includes(Status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const affected = await CustomerModel.update(req.params.id, {
        FirstName, LastName, Email, PhoneNumber, Status
      });

      if (affected === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      const customer = await CustomerModel.findById(req.params.id);
      res.json(customer);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      console.error('Update customer error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const affected = await CustomerModel.delete(req.params.id);
      if (affected === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Delete customer error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = CustomerController;
