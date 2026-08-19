import { type Document, model, Schema } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  key: string;
  description?: string;
  module?: string;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>(
  {
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    module: { type: String, trim: true },
  },
  { timestamps: true },
);

export const Permission = model<IPermission>('Permission', permissionSchema);
