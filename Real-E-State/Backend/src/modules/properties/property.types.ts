import type { Document, Types } from 'mongoose';

export interface IProperty {
  agencyId: Types.ObjectId;
  propertyId?: string;
  propertyName: string;
  propertyType:
    | 'Apartment'
    | 'Villa'
    | 'House'
    | 'Office'
    | 'Shop'
    | 'Warehouse'
    | 'Land'
    | 'Plot'
    | 'Commercial';
  category?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  area: number;
  areaUnit?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  furnishedStatus?: string;
  constructionStatus?: string;
  ownership?: string;
  facing?: string;
  description?: string;
  amenities?: string[];
  images?: string[];
  documents?: string[];
  agentId?: Types.ObjectId;
  status: 'Available' | 'Reserved' | 'Sold' | 'Rented' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface IPropertyDocument extends IProperty, Document {}
