const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  entityType: {
    type: String,
    required: true,
    enum: ['Lead', 'Buyer', 'Seller', 'Deal', 'Property']
  },
  entityId: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  activityType: {
    type: String,
    required: true,
    enum: ['Call', 'WhatsApp', 'Email', 'Meeting', 'Site Visit', 'Note', 'StatusChange']
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  description: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
