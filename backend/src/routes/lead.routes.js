const express = require('express');
const { getLeads, getLead, createLead, updateLead, deleteLead } = require('../controllers/lead.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect); // All lead routes require authentication

router
  .route('/')
  .get(authorize('lead.read'), getLeads)
  .post(authorize('lead.create'), createLead);

router
  .route('/:id')
  .get(authorize('lead.read'), getLead)
  .put(authorize('lead.update'), updateLead)
  .delete(authorize('lead.delete'), deleteLead);

module.exports = router;
