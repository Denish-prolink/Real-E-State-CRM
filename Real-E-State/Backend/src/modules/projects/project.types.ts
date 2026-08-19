import { type Document, type Types } from 'mongoose';

export interface IProject {
  agencyId: Types.ObjectId;
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'Planned' | 'Active' | 'Completed' | 'On Hold';
  address?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectDocument extends IProject, Document {}
