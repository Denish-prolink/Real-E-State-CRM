export interface IProductPayload {
  title: string;
  description?: string;
  manufacturingDate?: string | Date;
  expiryDate?: string | Date;
  quantity: number;
  rawPrice: number;
  salePrice: number;
  brand?: string;
  category: string;
  subCategory?: string;
  status: 'Active' | 'Inactive' | 'Discontinued';
  barcode?: string;
  images?: string[];
  supplier: string[];
}
