import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    manufacturingDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    rawPrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Discontinued'],
      default: 'Active',
    },
    images: {
      type: [String],
      default: [],
    },
    supplier: {
      type: [String],
      required: true,
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agency',
      required: true,
    },

  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model('Product', productSchema);
