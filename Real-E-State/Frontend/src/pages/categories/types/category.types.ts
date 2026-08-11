export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormValues {
  name: string;
  description: string;
}
