const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    maxlength: [100, 'Company name can not be more than 100 characters']
  },
  email: {
    type: String,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters']
  },
  address: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Company', companySchema);
