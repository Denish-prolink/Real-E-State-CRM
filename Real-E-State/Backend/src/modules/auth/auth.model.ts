import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      // unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['super_admin', 'company'],
      default: 'company',
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model('User', userSchema);
