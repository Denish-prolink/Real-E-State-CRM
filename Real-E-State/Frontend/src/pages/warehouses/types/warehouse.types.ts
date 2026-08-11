import type { Employee } from "@/pages/employees/types/employee.types";

export interface Warehouse {
  _id: string;
  warehouseCode: string;
  warehouseName: string;
  warehouseType: 'Regular' | 'Distribution Center' | 'Cold Storage' | 'Retail' | 'Other';
  manager: Employee; // Populated employee object
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  capacity: number;
  usedCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddWarehousePayload {
  warehouseCode: string;
  warehouseName: string;
  warehouseType: 'Regular' | 'Distribution Center' | 'Cold Storage' | 'Retail' | 'Other';
  manager: string; // ID of the employee
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  capacity: number;
}

export type UpdateWarehousePayload = Partial<AddWarehousePayload>;
