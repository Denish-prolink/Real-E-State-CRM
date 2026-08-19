import { type Document, model, Schema, type Types } from 'mongoose';

export interface IUnit extends Document {
  projectId?: Types.ObjectId;
  towerId?: Types.ObjectId; // keep towerId or tower string
  tower?: string;
  floor?: number | string;
  unitNumber: string;
  unitType?: string;
  bhk?: string;
  area?: number;
  price?: number;
  facing?: string;
  status?: 'Available' | 'Hold' | 'Booked' | 'Sold' | 'Blocked';
  createdAt: Date;
  updatedAt: Date;
}

const unitSchema = new Schema<IUnit>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    towerId: { type: Schema.Types.ObjectId, ref: 'Tower' },
    tower: { type: String },
    floor: { type: Schema.Types.Mixed },
    unitNumber: { type: String, required: true, trim: true },
    unitType: { type: String },
    bhk: { type: String },
    area: { type: Number },
    price: { type: Number },
    facing: { type: String },
    status: {
      type: String,
      enum: ['Available', 'Hold', 'Booked', 'Sold', 'Blocked'],
      default: 'Available',
    },
  },
  { timestamps: true },
);

unitSchema.index({ towerId: 1, unitNumber: 1 }, { unique: true });

export const Unit = model<IUnit>('Unit', unitSchema);
