import { model, Schema } from 'mongoose';

import type { ILeadDocument } from './lead.types';

const leadSchema = new Schema<ILeadDocument>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    leadType: { type: String },
    source: {
      type: String,
      enum: [
        'Website',
        'Facebook',
        'Instagram',
        'Google',
        'WhatsApp',
        'Referral',
        'Property Portal',
        'Walk-in',
        'Phone',
        'Other',
      ],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Site Visit', 'Negotiation', 'Converted', 'Lost'],
      default: 'New',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    budget: { type: Number },
    propertyType: { type: String },
    preferredLocation: { type: String },
    assignedAgent: { type: Schema.Types.ObjectId, ref: 'User' },
    nextFollowUp: { type: Date },
    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

export const Lead = model<ILeadDocument>('Lead', leadSchema);
