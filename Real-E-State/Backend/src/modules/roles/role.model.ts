import { type Document, model, Schema, type Types } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description?: string;
  agencyId?: Types.ObjectId;
  permissions?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency' },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
  },
  { timestamps: true },
);

roleSchema.index({ name: 1, agencyId: 1 }, { unique: true });

export const Role = model<IRole>('Role', roleSchema);
