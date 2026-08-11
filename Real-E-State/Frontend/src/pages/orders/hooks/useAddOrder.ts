import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addOrderApi } from '../api/order.api';

export const useAddOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
