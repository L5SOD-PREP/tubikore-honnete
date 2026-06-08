const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/session', AuthController.checkSession);

// Admin-only routes
router.post('/users', requireAuth, requireRole('Admin'), AuthController.createUser);
router.get('/users', requireAuth, requireRole('Admin'), AuthController.getAllUsers);
router.delete('/users/:id', requireAuth, requireRole('Admin'), AuthController.deleteUser);

module.exports = router;
