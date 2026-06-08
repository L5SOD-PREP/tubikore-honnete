const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

const AuthController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      if (typeof username !== 'string' || username.trim().length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters' });
      }

      if (typeof password !== 'string' || password.length < 4) {
        return res.status(400).json({ message: 'Password must be at least 4 characters' });
      }

      const user = await UserModel.findByUsername(username.trim());
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.Password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      req.session.user = {
        UserID: user.UserID,
        UserName: user.UserName,
        Role: user.Role
      };

      res.json({
        message: 'Login successful',
        user: req.session.user
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  },

  checkSession: (req, res) => {
    if (req.session && req.session.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ message: 'No active session' });
    }
  },

  // Admin-only: Create a new user
  createUser: async (req, res) => {
    try {
      const { username, password, role } = req.body;

      // Validation
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      if (typeof username !== 'string' || username.trim().length < 3 || username.trim().length > 50) {
        return res.status(400).json({ message: 'Username must be between 3 and 50 characters' });
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
        return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
      }

      if (typeof password !== 'string' || password.length < 6 || password.length > 100) {
        return res.status(400).json({ message: 'Password must be between 6 and 100 characters' });
      }

      const validRoles = ['Admin'];
      const userRole = role && validRoles.includes(role) ? role : 'Admin';

      // Check if username already exists
      const existing = await UserModel.findByUsername(username.trim());
      if (existing) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = await UserModel.create({
        UserName: username.trim(),
        Password: hashedPassword,
        Role: userRole
      });

      const user = await UserModel.findById(id);
      res.status(201).json({
        message: 'User created successfully',
        user
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Username already exists' });
      }
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Admin-only: Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Admin-only: Delete a user
  deleteUser: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId) || userId < 1) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      // Don't allow deleting yourself
      if (userId === req.session.user.UserID) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }

      const affected = await UserModel.delete(userId);
      if (affected === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = AuthController;
