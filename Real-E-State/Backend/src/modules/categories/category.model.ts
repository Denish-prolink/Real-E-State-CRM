import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ name: 1, companyId: 1 }, { unique: true });

export const Category = mongoose.model('Category', categorySchema);
