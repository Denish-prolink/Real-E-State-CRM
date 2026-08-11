const User = require('../models/User');
const Company = require('../models/Company');
const Role = require('../models/Role');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, companyName } = req.body;

    // Create company
    const company = await Company.create({
      name: companyName,
      email
    });

    // Create default role for company
    const role = await Role.create({
      name: 'Super Admin',
      companyId: company._id,
      permissions: ['all'],
      isDefault: true
    });

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      companyId: company._id,
      roleId: role._id
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refresh = async (req, res, next) => {
  try {
    // Basic implementation - this should ideally verify the refresh token from DB/cookies
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }
    
    // In production: verify refresh token, then issue new tokens
    res.status(200).json({ success: true, message: 'Refresh functionality mock' });
  } catch (error) {
    next(error);
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();

  res.status(statusCode).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        companyId: user.companyId,
        roleId: user.roleId
      },
      accessToken,
      refreshToken
    }
  });
};
