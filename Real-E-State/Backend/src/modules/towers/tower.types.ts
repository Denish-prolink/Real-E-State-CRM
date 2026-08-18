import { type Document, type Types } from 'mongoose';

export interface ITower {
  projectId: Types.ObjectId;
  name: string;
  floors?: number;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITowerDocument extends ITower, Document {}
