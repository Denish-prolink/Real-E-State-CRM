export interface PropertyLocation {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyMedia {
  url: string;
  fileType: string;
}

export interface Property {
  _id: string;
  companyId: string;
  propertyId?: string;
  title: string;
  description?: string;
  propertyType: 'Apartment' | 'Villa' | 'House' | 'Plot' | 'Office' | 'Shop' | 'Warehouse' | 'Land' | 'Commercial';
  purpose: 'Sale' | 'Rent' | 'Lease';
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  location?: PropertyLocation;
  projectId?: {
    _id: string;
    name: string;
  } | string | null;
  tower?: string;
  floor?: string;
  unitNumber?: string;
  agentId?: string | null;
  status: 'Available' | 'Reserved' | 'Blocked' | 'Booked' | 'Sold';
  photos?: string[];
  media?: PropertyMedia[];
  createdAt: string;
  updatedAt: string;
}

export type AddPropertyPayload = Omit<Property, '_id' | 'companyId' | 'createdAt' | 'updatedAt'>;
export type UpdatePropertyPayload = Partial<AddPropertyPayload>;
