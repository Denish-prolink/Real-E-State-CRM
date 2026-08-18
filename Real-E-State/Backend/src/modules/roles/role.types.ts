import { type Document, type Types } from 'mongoose';

export interface IRole {
  name: string;
  description?: string;
  companyId?: Types.ObjectId;
  permissions?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoleDocument extends IRole, Document {}
