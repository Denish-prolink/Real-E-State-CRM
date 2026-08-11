const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  propertyId: { type: String, unique: true }, // e.g., PROP-1024
  title: { type: String, required: true },
  description: { type: String },
  propertyType: {
    type: String,
    enum: ['Apartment', 'Villa', 'House', 'Plot', 'Office', 'Shop', 'Warehouse', 'Land', 'Commercial'],
    required: true
  },
  purpose: {
    type: String,
    enum: ['Sale', 'Rent', 'Lease'],
    required: true
  },
  
  price: { type: Number, required: true },
  area: { type: Number, required: true }, // sq ft
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  parking: { type: Number },
  
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  
  projectId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project'
  },
  tower: String,
  floor: String,
  unitNumber: String,
  
  ownerId: {
    type: mongoose.Schema.ObjectId,
    // Would ref Seller/Owner model
  },
  agentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  
  status: {
    type: String,
    enum: ['Available', 'Reserved', 'Blocked', 'Booked', 'Sold'],
    default: 'Available'
  },
  
  media: [{
    type: String, // URLs to Cloudinary/S3
    url: String,
    fileType: String // Image, Video, Document
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  // Generate a mock property ID if not present
  if (!this.propertyId) {
    this.propertyId = 'PROP-' + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);
