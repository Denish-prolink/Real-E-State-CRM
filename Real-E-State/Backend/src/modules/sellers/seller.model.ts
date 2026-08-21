import { type Document, model, Schema, type Types } from 'mongoose';

export interface ISeller extends Document {
  agencyId: Types.ObjectId;
  contactId?: Types.ObjectId;
  leadId?: Types.ObjectId;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const sellerSchema = new Schema<ISeller>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact' },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
    notes: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  },
);

export const Seller = model<ISeller>('Seller', sellerSchema);
