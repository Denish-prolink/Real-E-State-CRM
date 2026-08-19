import { type Document, model, Schema, type Types } from 'mongoose';

export interface ICall extends Document {
  agencyId: Types.ObjectId;
  customerId?: Types.ObjectId;
  leadId?: Types.ObjectId;
  agentId?: Types.ObjectId;
  phone?: string;
  callDate?: Date;
  duration?: number;
  callType?: string;
  callStatus?: string;
  notes?: string;
  nextFollowUp?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const callSchema = new Schema<ICall>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    phone: { type: String },
    callDate: { type: Date },
    duration: { type: Number }, // in seconds
    callType: { type: String },
    callStatus: {
      type: String,
      enum: ['Connected', 'Not Connected', 'Busy', 'Wrong Number', 'Interested', 'Not Interested'],
    },
    notes: { type: String },
    nextFollowUp: { type: Date },
  },
  {
    timestamps: true,
  },
);

export const Call = model<ICall>('Call', callSchema);
