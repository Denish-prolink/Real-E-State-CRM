import { type Document, model, Schema } from 'mongoose';

export interface IAgency extends Document {
  name: string;
  gst?: string;
  sences?: string;
  pan?: string;
  members?: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  contactNumber: string;
  email?: string;
  logo?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const agencySchema = new Schema<IAgency>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gst: {
      type: String,
      trim: true,
    },
    sences: {
      type: String,
      trim: true,
    },
    pan: {
      type: String,
      trim: true,
    },
    members: {
      type: Number,
      default: 0,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    logo: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);

export const Agency = model<IAgency>('Agency', agencySchema);
