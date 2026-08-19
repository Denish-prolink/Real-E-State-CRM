import { type Document, model, Schema, type Types } from 'mongoose';

export interface IAuditLog extends Document {
  agencyId?: Types.ObjectId;
  userId?: Types.ObjectId;
  action: string;
  module: string;
  recordId?: Types.ObjectId;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    module: { type: String, required: true },
    recordId: { type: Schema.Types.ObjectId },
    oldData: { type: Schema.Types.Mixed },
    newData: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  {
    timestamps: true,
  },
);

export const AuditLog = model<IAuditLog>('AuditLog', auditLogSchema);
