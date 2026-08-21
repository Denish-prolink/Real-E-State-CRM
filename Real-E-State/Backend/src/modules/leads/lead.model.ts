import { model, Schema } from 'mongoose';

import { ILeadDocument } from './lead.types';

const leadSchema = new Schema<ILeadDocument>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    source: {
      type: String,
      enum: ['Website', 'Referral', 'Social Media', 'Cold Call', 'WhatsApp', 'Other'],
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
    location: { type: String },
    bedrooms: { type: Number },
    area: { type: Number },
    assignedAgent: { type: Schema.Types.ObjectId, ref: 'User' },
    expectedPurchaseDate: { type: Date },
    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

export const Lead = model<ILeadDocument>('Lead', leadSchema);
