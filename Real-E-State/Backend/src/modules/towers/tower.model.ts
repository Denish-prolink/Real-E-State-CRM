import { type Document, model, Schema, type Types } from 'mongoose';

export interface ITower extends Document {
  projectId: Types.ObjectId;
  name: string;
  floors?: number;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const towerSchema = new Schema<ITower>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true },
    floors: { type: Number, default: 0 },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

towerSchema.index({ projectId: 1, name: 1 }, { unique: true });

export const Tower = model<ITower>('Tower', towerSchema);
