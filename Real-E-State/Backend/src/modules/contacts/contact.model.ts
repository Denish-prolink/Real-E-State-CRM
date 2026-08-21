import { type Document, model, Schema, type Types } from 'mongoose';

export interface IContact extends Document {
  agencyId: Types.ObjectId;
  name: string;
  type:
    | 'customer'
    | 'supplier'
    | 'vendor'
    | 'seller'
    | 'other'
    | 'Buyer'
    | 'Seller'
    | 'Architect'
    | 'Broker'
    | 'Civil Engineer'
    | 'Construction Contractor'
    | 'Developer'
    | 'Influencer'
    | 'Interior Designer'
    | 'Landscape Designer'
    | 'Legal Advisor'
    | 'Property Owner'
    | 'Structure Designer';
  email: string;
  mobileNo: string;
  gender: 'male' | 'female' | 'other';
  dob?: Date;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'customer',
        'supplier',
        'vendor',
        'seller',
        'other',
        'Buyer',
        'Seller',
        'Architect',
        'Broker',
        'Civil Engineer',
        'Construction Contractor',
        'Developer',
        'Influencer',
        'Interior Designer',
        'Landscape Designer',
        'Legal Advisor',
        'Property Owner',
        'Structure Designer',
      ],
      required: true,
      default: 'Buyer',
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobileNo: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Contact = model<IContact>('Contact', contactSchema);
