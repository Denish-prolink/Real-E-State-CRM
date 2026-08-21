import { type Document, model, Schema, type Types } from 'mongoose';

export interface IEmployee extends Document {
  agencyId: Types.ObjectId;
  employeeCode: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: Date;
  gender?: 'male' | 'female' | 'other';
  dob?: Date;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    employeeCode: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNo: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
      trim: true,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

employeeSchema.index({ employeeCode: 1, agencyId: 1 }, { unique: true });

export const Employee = model<IEmployee>('Employee', employeeSchema);
