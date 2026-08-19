import { type Document, model, Schema, type Types } from 'mongoose';

export interface IEmail extends Document {
  agencyId: Types.ObjectId;
  customerId?: Types.ObjectId;
  agentId?: Types.ObjectId;
  to: string;
  cc?: string;
  subject: string;
  message: string;
  status?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const emailSchema = new Schema<IEmail>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: String, required: true },
    cc: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'Sent' },
    sentAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const Email = model<IEmail>('Email', emailSchema);
