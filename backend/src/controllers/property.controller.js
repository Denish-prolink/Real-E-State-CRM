const Property = require('../models/Property');

// @desc    Get all properties for company
// @route   GET /api/properties
// @access  Private
exports.getProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ companyId: req.user.companyId }).populate('projectId', 'name');
    res.status(200).json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Private
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, companyId: req.user.companyId }).populate('projectId', 'name');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
exports.createProperty = async (req, res, next) => {
  try {
    req.body.companyId = req.user.companyId;
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
