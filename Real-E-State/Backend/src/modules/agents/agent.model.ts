import { type Document, model, Schema, type Types } from 'mongoose';

export interface IAgent extends Document {
  userId?: Types.ObjectId;
  agencyId: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  licenseNo?: string;
  active?: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const agentSchema = new Schema<IAgent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    licenseNo: { type: String, trim: true },
    active: { type: Boolean, default: true },
    notes: { type: String },
  },
  { timestamps: true },
);

agentSchema.index({ agencyId: 1, email: 1 }, { unique: false });

export const Agent = model<IAgent>('Agent', agentSchema);
