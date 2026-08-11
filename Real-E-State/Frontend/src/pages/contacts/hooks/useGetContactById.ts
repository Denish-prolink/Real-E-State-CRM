import { useQuery } from '@tanstack/react-query';
import { getContactByIdApi } from '../api/contact.api';

export const useGetContactById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: async () => {
      const response = await getContactByIdApi(id);
      return response.data;
    },
    ...options,
  });
};
