export interface Agency {
  _id: string;
  name: string;
  gst?: string;
  sences?: string;
  pan?: string;
  members: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  contactNumber: string;
  email?: string;
  logo?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface GetAgenciesResponse {
  data: Agency[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AddAgencyPayload extends Omit<Agency, '_id' | 'createdAt' | 'updatedAt'> {
  logoFile?: File | null;
  password?: string;
}
export type UpdateAgencyPayload = Partial<AddAgencyPayload>;
