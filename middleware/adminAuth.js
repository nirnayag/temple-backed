module.exports = function (req, res, next) {
  // Assuming req.user is set by your auth middleware
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin)) {
    return next();
  }
  return res.status(403).json({ message: 'Admin access required' });
}; 