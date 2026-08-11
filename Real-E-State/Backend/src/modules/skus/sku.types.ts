export interface ISkuPayload {
  name: string;
  unit:
    | 'ml'
    | 'DOZEN'
    | 'BOX'
    | 'GRAMS'
    | 'KILOGRAMS'
    | 'METERS'
    | 'TABLETS'
    | 'UNITS'
    | 'PIECES'
    | 'PAIRS';
  skuCode: string;
  description?: string;
}
