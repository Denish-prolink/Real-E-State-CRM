import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteOrderApi } from '../api/order.api';

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
