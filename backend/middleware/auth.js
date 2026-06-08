const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.session && req.session.user && req.session.user.Role === role) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
    }
  };
};

module.exports = { requireAuth, requireRole };
