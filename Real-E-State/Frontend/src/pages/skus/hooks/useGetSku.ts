import { useQuery } from '@tanstack/react-query';
import { getSkuById } from '../services/sku.service';

export const useGetSku = (id: string | null) => {
  return useQuery({
    queryKey: ['sku', id],
    queryFn: () => getSkuById(id as string),
    enabled: !!id,
  });
};
