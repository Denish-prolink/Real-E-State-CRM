const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Get all leads for company
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find({ companyId: req.user.companyId }).populate('assignedAgent', 'name email');
    res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, companyId: req.user.companyId })
      .populate('assignedAgent', 'name email');
    
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res, next) => {
  try {
    req.body.companyId = req.user.companyId;
    
    // Create Lead
    const lead = await Lead.create(req.body);

    // Create Activity
    await Activity.create({
      companyId: req.user.companyId,
      entityType: 'Lead',
      entityId: lead._id,
      activityType: 'Note',
      userId: req.user._id,
      description: 'Lead was created.'
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res, next) => {
  try {
    let lead = await Lead.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const previousStatus = lead.status;
    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (req.body.status && previousStatus !== req.body.status) {
      await Activity.create({
        companyId: req.user.companyId,
        entityType: 'Lead',
        entityId: lead._id,
        activityType: 'StatusChange',
        userId: req.user._id,
        description: `Lead status changed from ${previousStatus} to ${req.body.status}`
      });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    // Note: In real app, we might just soft delete or delete related activities too
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
