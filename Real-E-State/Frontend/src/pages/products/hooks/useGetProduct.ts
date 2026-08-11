import { useQuery } from '@tanstack/react-query';
import { getProductByIdApi } from '../api/product.api';

export const useGetProduct = (id: string | null) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductByIdApi(id as string),
    enabled: !!id,
  });
};
