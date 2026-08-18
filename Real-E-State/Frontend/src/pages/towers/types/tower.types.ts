export interface Tower {
  _id: string;
  projectId: {
    _id: string;
    name: string;
  } | string;
  name: string;
  floors: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type AddTowerPayload = Omit<Tower, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateTowerPayload = Partial<AddTowerPayload>;
