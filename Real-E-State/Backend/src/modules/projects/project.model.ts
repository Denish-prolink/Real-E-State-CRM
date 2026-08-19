import { type Document, model, Schema, type Types } from 'mongoose';

export interface IProject extends Document {
  agencyId: Types.ObjectId;
  name: string;
  projectCode?: string;
  developer?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  projectType?: string;
  totalTowers?: number;
  totalUnits?: number;
  availableUnits?: number;
  amenities?: string[];
  reraNumber?: string;
  possessionDate?: Date;
  startingPrice?: number;
  description?: string;
  images?: string[];
  documents?: string[];
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    name: { type: String, required: true, trim: true },
    projectCode: { type: String, trim: true },
    developer: { type: String },
    location: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    projectType: { type: String },
    totalTowers: { type: Number },
    totalUnits: { type: Number },
    availableUnits: { type: Number },
    amenities: [{ type: String }],
    reraNumber: { type: String },
    possessionDate: { type: Date },
    startingPrice: { type: Number },
    description: { type: String, trim: true },
    images: [{ type: String }],
    documents: [{ type: String }],
    status: {
      type: String,
      enum: ['Planned', 'Active', 'Completed', 'On Hold'],
      default: 'Planned',
    },
  },
  { timestamps: true },
);

projectSchema.index({ name: 1, agencyId: 1 }, { unique: true });

export const Project = model<IProject>('Project', projectSchema);
