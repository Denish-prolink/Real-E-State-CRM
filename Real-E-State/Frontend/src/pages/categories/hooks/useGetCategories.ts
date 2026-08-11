import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/category.service';

export const useGetCategories = (params: { page?: number; perPage?: number; search?: string } = {}, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['categories', params.page, params.perPage, params.search],
    queryFn: () => getCategories(params),
    enabled,
  });
};
