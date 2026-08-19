import { type Document, model, Schema, type Types } from 'mongoose';

export interface IBuyer extends Document {
  agencyId: Types.ObjectId;
  contactId?: Types.ObjectId;
  leadId?: Types.ObjectId;
  notes?: string;
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const buyerSchema = new Schema<IBuyer>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact' },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
    notes: { type: String, trim: true },
    preferences: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  },
);

export const Buyer = model<IBuyer>('Buyer', buyerSchema);
