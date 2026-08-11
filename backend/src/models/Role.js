const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a role name'],
    trim: true,
  },
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  permissions: {
    type: [String],
    default: []
  },
  isDefault: {
    type: Boolean,
    default: false // e.g., default 'Sales Agent' role
  }
});

module.exports = mongoose.model('Role', roleSchema);
