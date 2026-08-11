import type { Contact } from '@/pages/contacts/types/contact.types';

export interface OrderItem {
  warehouse: string;
  product: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  _id: string;
  orderType: 'purchase' | 'sell';
  contact: Contact;
  items: OrderItem[];
  gstAndCharges: number;
  discountType: 'percentage' | 'amount';
  discountValue: number;
  finalPrice: number;
  deliveryAddress: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemPayload {
  warehouse: string;
  product: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

export interface AddOrderPayload {
  orderType: 'purchase' | 'sell';
  contact: string;
  items: OrderItemPayload[];
  gstAndCharges: number;
  discountType: 'percentage' | 'amount';
  discountValue: number;
  finalPrice: number;
  deliveryAddress: string;
}

export type UpdateOrderPayload = Partial<AddOrderPayload>;
