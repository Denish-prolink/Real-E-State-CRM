import { useQuery } from '@tanstack/react-query';
import { getLeadsApi } from '../api/lead.api';

export const useGetLeads = (
  params: { page?: number; perPage?: number; search?: string } = {},
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['leads', params.page, params.perPage, params.search],
    queryFn: async () => {
      const response = await getLeadsApi(params);
      return response.data;
    },
    ...options,
  });
};
