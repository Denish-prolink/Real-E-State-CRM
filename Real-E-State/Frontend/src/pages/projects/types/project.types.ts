export interface Project {
  _id: string;
  companyId: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: 'Planned' | 'Active' | 'Completed' | 'On Hold';
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddProjectPayload = Omit<Project, '_id' | 'companyId' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectPayload = Partial<AddProjectPayload>;
