import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderApi } from '../api/order.api';

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
