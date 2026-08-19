import { type Document, model, Schema, type Types } from 'mongoose';

export interface IWarehouse extends Document {
  warehouseCode: string;
  warehouseName: string;
  warehouseType: 'Regular' | 'Distribution Center' | 'Cold Storage' | 'Retail' | 'Other';
  manager: Types.ObjectId; // Reference to Employee
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  capacity: number;
  usedCapacity: number;
  agencyId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const warehouseSchema = new Schema<IWarehouse>(
  {
    warehouseCode: {
      type: String,
      required: true,
      trim: true,
    },
    warehouseName: {
      type: String,
      required: true,
      trim: true,
    },
    warehouseType: {
      type: String,
      enum: ['Regular', 'Distribution Center', 'Cold Storage', 'Retail', 'Other'],
      required: true,
      default: 'Regular',
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 0,
    },
    usedCapacity: {
      type: Number,
      default: 0,
      min: 0,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

warehouseSchema.index({ warehouseCode: 1, agencyId: 1 }, { unique: true });

export const Warehouse = model<IWarehouse>('Warehouse', warehouseSchema);
