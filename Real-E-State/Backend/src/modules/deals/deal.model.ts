import { model, Schema } from 'mongoose';

import type { IDealDocument } from './deal.types';

const dealSchema = new Schema<IDealDocument>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    dealId: { type: String },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer' },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller' },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    dealAmount: { type: Number, required: true },
    commission: { type: Number },
    discount: { type: Number, default: 0 },
    expectedClosingDate: { type: Date },
    closingDate: { type: Date },
    status: {
      type: String,
      enum: [
        'Lead',
        'Qualified',
        'Site Visit',
        'Negotiation',
        'Booking',
        'Agreement',
        'Closed',
        'Lost',
      ],
      default: 'Lead',
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

export const Deal = model<IDealDocument>('Deal', dealSchema);
