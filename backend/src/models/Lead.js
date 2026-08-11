const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  firstName: { type: String, required: true },
  lastName: { type: String },
  phone: { type: String, required: true },
  email: { type: String },
  
  source: { 
    type: String, 
    enum: ['Website', 'Referral', 'Social Media', 'Cold Call', 'WhatsApp', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Site Visit', 'Negotiation', 'Converted', 'Lost'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  
  budget: { type: Number },
  propertyType: { type: String },
  location: { type: String },
  bedrooms: { type: Number },
  area: { type: Number }, // in sq ft
  
  assignedAgent: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  expectedPurchaseDate: { type: Date },
  notes: { type: String },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

leadSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Lead', leadSchema);
