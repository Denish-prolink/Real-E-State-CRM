const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate('roleId');
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles/permissions
exports.authorize = (...permissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roleId) {
      return res.status(403).json({ success: false, message: 'User role not found' });
    }
    const userPermissions = req.user.roleId.permissions || [];
    
    // Super admin bypass or explicit permission
    const hasPermission = userPermissions.includes('all') || permissions.some(p => userPermissions.includes(p));

    if (!hasPermission) {
      return res.status(403).json({ success: false, message: `User role is not authorized to access this route` });
    }
    next();
  };
};
