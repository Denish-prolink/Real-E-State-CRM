export interface Property {
  _id: string;
  agencyId: string;
  propertyId?: string;
  propertyName: string;
  propertyType: 'Apartment' | 'Villa' | 'House' | 'Office' | 'Shop' | 'Warehouse' | 'Land' | 'Plot' | 'Commercial';
  category?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  area: number;
  areaUnit?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  furnishedStatus?: string;
  constructionStatus?: string;
  ownership?: string;
  facing?: string;
  description?: string;
  amenities?: string[];
  images?: string[];
  documents?: string[];
  agentId?: string | null;
  status: 'Available' | 'Reserved' | 'Sold' | 'Rented' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export type AddPropertyPayload = Omit<Property, '_id' | 'agencyId' | 'createdAt' | 'updatedAt'>;
export type UpdatePropertyPayload = Partial<AddPropertyPayload>;
