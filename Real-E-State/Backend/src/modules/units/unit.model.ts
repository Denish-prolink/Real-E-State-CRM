import { type Document, model, Schema, type Types } from 'mongoose';

export interface IUnit extends Document {
  projectId?: Types.ObjectId;
  towerId?: Types.ObjectId;
  unitNumber: string;
  floor?: number | string;
  size?: number;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: 'Available' | 'Reserved' | 'Booked' | 'Sold';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const unitSchema = new Schema<IUnit>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    towerId: { type: Schema.Types.ObjectId, ref: 'Tower' },
    unitNumber: { type: String, required: true, trim: true },
    floor: { type: Schema.Types.Mixed },
    size: { type: Number },
    price: { type: Number },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    status: { type: String, enum: ['Available', 'Reserved', 'Booked', 'Sold'], default: 'Available' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

unitSchema.index({ towerId: 1, unitNumber: 1 }, { unique: true });

export const Unit = model<IUnit>('Unit', unitSchema);
