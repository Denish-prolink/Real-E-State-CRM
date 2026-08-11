import { useQuery } from '@tanstack/react-query';
import { getCategoryByIdApi } from '../api/category.api';

export const useGetCategory = (id: string | null) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryByIdApi(id as string),
    enabled: !!id,
  });
};
