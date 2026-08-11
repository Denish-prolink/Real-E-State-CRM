const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  status: {
    type: String,
    enum: ['Planning', 'Under Construction', 'Completed', 'On Hold'],
    default: 'Planning'
  },
  towers: [{
    name: String,
    floors: Number,
    totalUnits: Number
  }],
  amenities: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
