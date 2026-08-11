export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type PaginatedResponse<T, K extends string> = {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
} & {
  [key in K]: T[];
};
