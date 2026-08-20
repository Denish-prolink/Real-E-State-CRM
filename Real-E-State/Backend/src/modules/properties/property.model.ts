import { model, Schema } from 'mongoose';
import { IPropertyDocument } from './property.types';

const propertySchema = new Schema<IPropertyDocument>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    propertyId: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    propertyType: {
      type: String,
      enum: ['Apartment', 'Villa', 'House', 'Plot', 'Office', 'Shop', 'Warehouse', 'Land', 'Commercial'],
      required: true,
    },
    purpose: {
      type: String,
      enum: ['Sale', 'Rent', 'Lease'],
      required: true,
    },
    price: { type: Number, required: true },
    area: { type: Number, required: true },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    parking: { type: Number },
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    tower: String,
    floor: String,
    unitNumber: String,
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Blocked', 'Booked', 'Sold'],
      default: 'Available',
    },
    photos: [String],
    media: [
      {
        url: String,
        fileType: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);


export const Property = model<IPropertyDocument>('Property', propertySchema);
