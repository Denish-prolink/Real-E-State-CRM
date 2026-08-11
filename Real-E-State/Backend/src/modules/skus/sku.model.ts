import mongoose from 'mongoose';

const skuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      enum: [
        'ml',
        'DOZEN',
        'BOX',
        'GRAMS',
        'KILOGRAMS',
        'METERS',
        'TABLETS',
        'UNITS',
        'PIECES',
        'PAIRS',
      ],
    },
    skuCode: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
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

skuSchema.index({ skuCode: 1, companyId: 1 }, { unique: true });

export const Sku = mongoose.model('Sku', skuSchema);
