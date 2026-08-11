import { useQuery } from '@tanstack/react-query';
import { getOrderByIdApi } from '../api/order.api';

export const useGetOrderById = (id: string | null, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      if (!id) throw new Error('Order ID is required');
      const response = await getOrderByIdApi(id);
      return response.data;
    },
    enabled: !!id && options?.enabled !== false,
  });
};
