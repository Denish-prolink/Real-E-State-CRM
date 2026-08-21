import { model, Schema } from 'mongoose';

import { ISiteVisitDocument } from './site-visit.types';

const siteVisitSchema = new Schema<ISiteVisitDocument>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    visitDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled', 'No Show'],
      default: 'Scheduled',
    },
    feedback: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

export const SiteVisit = model<ISiteVisitDocument>('SiteVisit', siteVisitSchema);
