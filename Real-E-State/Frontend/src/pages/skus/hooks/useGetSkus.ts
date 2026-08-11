import { useQuery } from '@tanstack/react-query';
import { getSkus } from '../services/sku.service';

export const useGetSkus = (params: { page?: number; perPage?: number; search?: string } = {}, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['skus', params.page, params.perPage, params.search],
    queryFn: () => getSkus(params),
    enabled,
  });
};
