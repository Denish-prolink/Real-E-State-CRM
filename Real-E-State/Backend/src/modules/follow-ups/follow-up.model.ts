import { type Document, model, Schema, type Types } from 'mongoose';

export interface IFollowUp extends Document {
  agencyId: Types.ObjectId;
  leadId?: Types.ObjectId;
  customerId?: Types.ObjectId;
  agentId?: Types.ObjectId;
  followUpType?: string;
  date?: Date;
  time?: string;
  status?: string;
  notes?: string;
  nextFollowUp?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const followUpSchema = new Schema<IFollowUp>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    followUpType: {
      type: String,
      enum: ['Call', 'WhatsApp', 'Email', 'Meeting', 'Site Visit', 'Other'],
    },
    date: { type: Date },
    time: { type: String },
    status: { type: String, default: 'Pending' },
    notes: { type: String },
    nextFollowUp: { type: Date },
  },
  {
    timestamps: true,
  },
);

export const FollowUp = model<IFollowUp>('FollowUp', followUpSchema);
