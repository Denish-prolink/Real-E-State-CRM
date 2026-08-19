import { model, Schema } from 'mongoose';

import type { IPropertyDocument } from './property.types';

const propertySchema = new Schema<IPropertyDocument>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    propertyId: { type: String },
    propertyName: { type: String, required: true },
    propertyType: {
      type: String,
      enum: [
        'Apartment',
        'Villa',
        'House',
        'Office',
        'Shop',
        'Warehouse',
        'Land',
        'Plot',
        'Commercial',
      ],
      required: true,
    },
    category: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    price: { type: Number, required: true },
    area: { type: Number, required: true },
    areaUnit: { type: String },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    parking: { type: Number },
    furnishedStatus: { type: String },
    constructionStatus: { type: String },
    ownership: { type: String },
    facing: { type: String },
    description: { type: String },
    amenities: [{ type: String }],
    images: [{ type: String }],
    documents: [{ type: String }],
    agentId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Sold', 'Rented', 'Inactive'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  },
);

export const Property = model<IPropertyDocument>('Property', propertySchema);
