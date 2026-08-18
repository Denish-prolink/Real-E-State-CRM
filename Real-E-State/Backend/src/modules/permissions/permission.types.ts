import { type Document } from 'mongoose';

export interface IPermission {
  name: string;
  key: string;
  description?: string;
  module?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPermissionDocument extends IPermission, Document {}
