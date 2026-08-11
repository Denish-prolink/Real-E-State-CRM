export type ProductStatus = "Active" | "Inactive" | "Discontinued";

export interface Product {
  id: string;
  title: string;
  description: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity?: number;
  rawPrice: number;
  salePrice: number;
  category: string;
  subCategory: string;
  status: ProductStatus;
  images: string[];
  supplier: string | string[];
  createdAt: string;
}

export type ProductFormValues = Omit<Product, "id" | "createdAt"> & {
  files?: File[];
};
