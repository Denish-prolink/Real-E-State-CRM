import { Document, Types } from 'mongoose';

export interface IDocument {
  companyId: Types.ObjectId;
  title: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy: Types.ObjectId;
  relatedType?: string; // e.g., 'Lead', 'Property', 'User', 'Deal'
  relatedId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocumentDocument extends IDocument, Document {}
