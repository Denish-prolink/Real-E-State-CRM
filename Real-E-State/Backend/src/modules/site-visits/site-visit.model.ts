import { model, Schema } from 'mongoose';

import type { ISiteVisitDocument } from './site-visit.types';

const siteVisitSchema = new Schema<ISiteVisitDocument>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
    buyerId: { type: Schema.Types.ObjectId, ref: 'Buyer' },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    visitDate: { type: Date, required: true },
    visitTime: { type: String },
    location: { type: String },
    status: {
      type: String,
      enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled', 'No Show'],
      default: 'Scheduled',
    },
    notes: { type: String },
    feedback: { type: String },
  },
  {
    timestamps: true,
  },
);

export const SiteVisit = model<ISiteVisitDocument>('SiteVisit', siteVisitSchema);
