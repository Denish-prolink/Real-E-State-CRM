export interface Project {
  _id: string;
  agencyId: string;
  name: string;
  projectCode?: string;
  developer?: string;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  projectType?: string;
  totalTowers?: number;
  totalUnits?: number;
  availableUnits?: number;
  amenities?: string[];
  reraNumber?: string;
  possessionDate?: string;
  startingPrice?: number;
  description?: string;
  images?: string[];
  documents?: string[];
  status: 'Planned' | 'Active' | 'Completed' | 'On Hold';
  createdAt: string;
  updatedAt: string;
}

export type AddProjectPayload = Omit<Project, '_id' | 'agencyId' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectPayload = Partial<AddProjectPayload>;
