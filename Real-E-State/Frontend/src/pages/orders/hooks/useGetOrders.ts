import { useQuery } from '@tanstack/react-query';
import { getOrdersApi } from '../api/order.api';

export const useGetOrders = (params: { page?: number; perPage?: number; orderType?: string; search?: string } = {}, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['orders', params.page, params.perPage, params.orderType, params.search],
    queryFn: async () => {
      const response = await getOrdersApi(params);
      return response.data;
    },
    ...options,
  });
};
