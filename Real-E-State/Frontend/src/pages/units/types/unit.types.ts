export interface Unit {
  _id: string;
  projectId?: {
    _id: string;
    name: string;
  } | string | null;
  towerId?: string | null;
  tower?: string;
  floor?: number | string;
  unitNumber: string;
  unitType?: string;
  bhk?: string;
  area?: number;
  price?: number;
  facing?: string;
  status: 'Available' | 'Hold' | 'Booked' | 'Sold' | 'Blocked';
  createdAt: string;
  updatedAt: string;
}

export type AddUnitPayload = Omit<Unit, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateUnitPayload = Partial<AddUnitPayload>;
