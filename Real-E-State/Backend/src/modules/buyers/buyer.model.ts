import { type Document, model, Schema, type Types } from 'mongoose';

export interface IBuyer extends Document {
  agencyId: Types.ObjectId;
  name: string;
  email?: string;
  phone: string;
  budget?: number;
  propertyType?: string;
  preferredLocation?: string;
  purpose?: string;
  assignedAgent?: Types.ObjectId;
  requirements?: string;
  status?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const buyerSchema = new Schema<IBuyer>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    budget: { type: Number },
    propertyType: { type: String },
    preferredLocation: { type: String },
    purpose: {
      type: String,
      enum: ['Investment', 'Residential', 'Commercial', 'Rental'],
    },
    assignedAgent: { type: Schema.Types.ObjectId, ref: 'User' },
    requirements: { type: String },
    status: { type: String, default: 'New' },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

export const Buyer = model<IBuyer>('Buyer', buyerSchema);
