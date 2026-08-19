import { type Document, model, Schema, type Types } from 'mongoose';

export interface IProject extends Document {
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

const projectSchema = new Schema<IProject>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ['Planned', 'Active', 'Completed', 'On Hold'], default: 'Planned' },
    address: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

projectSchema.index({ name: 1, agencyId: 1 }, { unique: true });

export const Project = model<IProject>('Project', projectSchema);
