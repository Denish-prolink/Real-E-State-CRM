import { type Document, model, Schema, type Types } from 'mongoose';

export interface ISeller extends Document {
  agencyId: Types.ObjectId;
  name: string;
  email?: string;
  phone: string;
  property?: Types.ObjectId;
  expectedPrice?: number;
  sellingReason?: string;
  assignedAgent?: Types.ObjectId;
  status?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sellerSchema = new Schema<ISeller>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property' },
    expectedPrice: { type: Number },
    sellingReason: { type: String },
    assignedAgent: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'New' },
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

export const Seller = model<ISeller>('Seller', sellerSchema);
