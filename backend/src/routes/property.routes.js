const express = require('express');
const { getProperties, getProperty, createProperty, updateProperty, deleteProperty } = require('../controllers/property.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect); // All property routes require authentication

router
  .route('/')
  .get(authorize('property.read'), getProperties)
  .post(authorize('property.create'), createProperty);

router
  .route('/:id')
  .get(authorize('property.read'), getProperty)
  .put(authorize('property.update'), updateProperty)
  .delete(authorize('property.delete'), deleteProperty);

module.exports = router;
