import { type Document, model, Schema, type Types } from 'mongoose';

export interface IWhatsApp extends Document {
  agencyId: Types.ObjectId;
  customerId?: Types.ObjectId;
  agentId?: Types.ObjectId;
  phone: string;
  message: string;
  direction: 'Incoming' | 'Outgoing';
  status?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const whatsappSchema = new Schema<IWhatsApp>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    direction: { type: String, enum: ['Incoming', 'Outgoing'], required: true },
    status: { type: String, default: 'Sent' },
    sentAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const WhatsApp = model<IWhatsApp>('WhatsApp', whatsappSchema);
