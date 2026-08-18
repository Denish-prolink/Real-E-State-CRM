export interface Unit {
  _id: string;
  projectId?: {
    _id: string;
    name: string;
  } | string | null;
  towerId?: {
    _id: string;
    name: string;
  } | string | null;
  unitNumber: string;
  floor?: number | string;
  size?: number;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  status: 'Available' | 'Reserved' | 'Booked' | 'Sold';
  createdAt: string;
  updatedAt: string;
}

export type AddUnitPayload = Omit<Unit, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateUnitPayload = Partial<AddUnitPayload>;
