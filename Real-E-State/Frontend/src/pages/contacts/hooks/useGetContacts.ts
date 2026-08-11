import { useQuery } from '@tanstack/react-query';
import { getContactsApi } from '../api/contact.api';

export const useGetContacts = (params: { page?: number; perPage?: number; search?: string } = {}, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['contacts', params.page, params.perPage, params.search],
    queryFn: async () => {
      const response = await getContactsApi(params);
      return response.data;
    },
    ...options,
  });
};
