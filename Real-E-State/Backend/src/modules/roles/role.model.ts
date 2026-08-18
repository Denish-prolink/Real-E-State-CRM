import { type Document, model, Schema, type Types } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description?: string;
  companyId?: Types.ObjectId;
  permissions?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
  },
  { timestamps: true },
);

roleSchema.index({ name: 1, companyId: 1 }, { unique: true });

export const Role = model<IRole>('Role', roleSchema);
