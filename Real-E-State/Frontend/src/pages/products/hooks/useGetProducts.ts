import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/product.service';

export const useGetProducts = (params: { page?: number; perPage?: number; search?: string } = {}) => {
  return useQuery({
    queryKey: ['products', params.page, params.perPage, params.search],
    queryFn: () => getProducts(params),
  });
};
