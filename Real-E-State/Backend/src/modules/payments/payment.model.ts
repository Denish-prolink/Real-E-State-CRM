import { type Document, model, Schema, type Types } from 'mongoose';

export interface IPayment extends Document {
  agencyId: Types.ObjectId;
  paymentId?: string;
  bookingId?: Types.ObjectId;
  customerId?: Types.ObjectId;
  amount: number;
  paymentDate?: Date;
  paymentMethod?: string;
  transactionId?: string;
  paymentType?: string;
  status?: string;
  receipt?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    paymentId: { type: String },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card', 'Online'],
    },
    transactionId: { type: String },
    paymentType: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Success', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    receipt: { type: String },
    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

export const Payment = model<IPayment>('Payment', paymentSchema);
