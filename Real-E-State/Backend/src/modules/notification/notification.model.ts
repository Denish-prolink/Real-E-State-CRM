import { type Document, model, Schema, type Types } from 'mongoose';

export interface INotification extends Document {
  agencyId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
  type?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String },
    link: { type: String },
  },
  {
    timestamps: true,
  },
);

export const Notification = model<INotification>('Notification', notificationSchema);
