import { type Document, model, Schema, type Types } from 'mongoose';

export interface IDocument extends Document {
  agencyId: Types.ObjectId;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy?: Types.ObjectId;
  relatedEntity?: string;
  entityId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String },
    fileSize: { type: Number },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    relatedEntity: {
      type: String,
      enum: ['Lead', 'Customer', 'Property', 'Project', 'Booking', 'Payment', 'Deal', 'Other'],
      default: 'Other',
    },
    entityId: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  },
);

export const AppDocument = model<IDocument>('Document', documentSchema);
