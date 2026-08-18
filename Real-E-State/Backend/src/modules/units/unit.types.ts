import { type Document, type Types } from 'mongoose';

export interface IUnit {
  projectId?: Types.ObjectId;
  towerId?: Types.ObjectId;
  unitNumber: string;
  floor?: number | string;
  size?: number;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: 'Available' | 'Reserved' | 'Booked' | 'Sold';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUnitDocument extends IUnit, Document {}
