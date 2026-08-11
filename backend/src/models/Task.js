const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  relatedEntityType: {
    type: String,
    enum: ['Lead', 'Deal', 'Property', 'Project', 'Other']
  },
  relatedEntityId: {
    type: mongoose.Schema.ObjectId
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ['Todo', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Todo'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Task', taskSchema);
