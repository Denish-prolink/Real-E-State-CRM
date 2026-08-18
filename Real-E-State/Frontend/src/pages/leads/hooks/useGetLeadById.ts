import { useQuery } from '@tanstack/react-query';
import { getLeadByIdApi } from '../api/lead.api';

export const useGetLeadById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: async () => {
      const response = await getLeadByIdApi(id);
      return response.data;
    },
    ...options,
  });
};
