export interface Project {
  _id: string;
  agencyId: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: 'Planned' | 'Active' | 'Completed' | 'On Hold';
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddProjectPayload = Omit<Project, '_id' | 'agencyId' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectPayload = Partial<AddProjectPayload>;
