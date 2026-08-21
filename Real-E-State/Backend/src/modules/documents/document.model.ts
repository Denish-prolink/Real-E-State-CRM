import { model, Schema } from 'mongoose';

import { IDocumentDocument } from './document.types';

const documentSchema = new Schema<IDocumentDocument>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    fileType: { type: String },
    fileSize: { type: Number },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relatedType: { type: String },
    relatedId: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  },
);

export const DocumentModel = model<IDocumentDocument>('Document', documentSchema);
