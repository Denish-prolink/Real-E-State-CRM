import { type Document, model, Schema, type Types } from 'mongoose';

export interface IOrderItem {
  warehouse: Types.ObjectId;
  product: Types.ObjectId;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IOrder extends Document {
  orderType: 'purchase' | 'sell';
  contact: Types.ObjectId;
  items: IOrderItem[];
  gstAndCharges: number;
  discountType: 'percentage' | 'amount';
  discountValue: number;
  finalPrice: number;
  deliveryAddress: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  agencyId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sku: {
      type: String,
      default: '',
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    orderType: {
      type: String,
      enum: ['purchase', 'sell'],
      required: true,
    },
    contact: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(val: IOrderItem[]) => val.length > 0, 'At least one item is required'],
    },
    gstAndCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'amount'],
      default: 'amount',
    },
    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryAddress: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
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

export const Order = model<IOrder>('Order', orderSchema);
