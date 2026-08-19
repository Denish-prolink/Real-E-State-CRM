import { type Document, model, Schema, type Types } from 'mongoose';

export interface IBooking extends Document {
  agencyId: Types.ObjectId;
  bookingNumber?: string;
  customerId?: Types.ObjectId;
  propertyId?: Types.ObjectId;
  projectId?: Types.ObjectId;
  unitId?: Types.ObjectId;
  agentId?: Types.ObjectId;
  bookingDate?: Date;
  bookingAmount?: number;
  totalAmount?: number;
  discount?: number;
  tax?: number;
  finalAmount?: number;
  paymentStatus?: string;
  bookingStatus?: string;
  documents?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    bookingNumber: { type: String, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    unitId: { type: Schema.Types.ObjectId, ref: 'Unit' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    bookingDate: { type: Date, default: Date.now },
    bookingAmount: { type: Number },
    totalAmount: { type: Number },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    finalAmount: { type: Number },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Partial', 'Completed', 'Failed'],
      default: 'Pending',
    },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    documents: [{ type: String }],
    notes: { type: String },
  },
  {
    timestamps: true,
  },
);

export const Booking = model<IBooking>('Booking', bookingSchema);
