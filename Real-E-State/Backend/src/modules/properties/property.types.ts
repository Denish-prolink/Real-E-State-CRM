import { Document, Types } from 'mongoose';

export interface IProperty {
  companyId: Types.ObjectId;
  propertyId?: string;
  title: string;
  description?: string;
  propertyType: 'Apartment' | 'Villa' | 'House' | 'Plot' | 'Office' | 'Shop' | 'Warehouse' | 'Land' | 'Commercial';
  purpose: 'Sale' | 'Rent' | 'Lease';
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  projectId?: Types.ObjectId;
  tower?: string;
  floor?: string;
  unitNumber?: string;
  agentId?: Types.ObjectId;
  status: 'Available' | 'Reserved' | 'Blocked' | 'Booked' | 'Sold';
  photos?: string[];
  media?: Array<{
    url: string;
    fileType: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPropertyDocument extends IProperty, Document {}
