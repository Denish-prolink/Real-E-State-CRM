import { model, Schema } from 'mongoose';

import { IDealDocument } from './deal.types';

const dealSchema = new Schema<IDealDocument>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    dealNumber: { type: String },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    dealValue: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    expectedClosingDate: { type: Date },
    stage: {
      type: String,
      enum: ['New', 'Qualified', 'Site Visit', 'Negotiation', 'Booking', 'Won', 'Lost'],
      default: 'New',
    },
    probability: { type: Number, default: 50 },
    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

export const Deal = model<IDealDocument>('Deal', dealSchema);
