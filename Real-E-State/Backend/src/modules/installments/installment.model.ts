import { type Document, model, Schema, type Types } from 'mongoose';

export interface IInstallment extends Document {
  agencyId: Types.ObjectId;
  bookingId?: Types.ObjectId;
  customerId?: Types.ObjectId;
  installmentNumber?: number;
  dueDate?: Date;
  dueAmount?: number;
  paidAmount?: number;
  remainingAmount?: number;
  paidDate?: Date;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

const installmentSchema = new Schema<IInstallment>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    installmentNumber: { type: Number },
    dueDate: { type: Date },
    dueAmount: { type: Number },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number },
    paidDate: { type: Date },
    status: {
      type: String,
      enum: ['Pending', 'Partially Paid', 'Paid', 'Overdue'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  },
);

export const Installment = model<IInstallment>('Installment', installmentSchema);
