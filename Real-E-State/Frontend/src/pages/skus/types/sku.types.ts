export type SkuUnit = 'ml' | 'DOZEN' | 'BOX' | 'GRAMS' | 'KILOGRAMS' | 'METERS' | 'TABLETS' | 'UNITS' | 'PIECES' | 'PAIRS';

export interface Sku {
  _id: string;
  name: string;
  unit: SkuUnit;
  skuCode: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type SkuFormValues = {
  name: string;
  unit: SkuUnit | '';
  skuCode: string;
  description: string;
};
