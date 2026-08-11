import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSku } from '../services/sku.service';

export const useDeleteSku = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSku(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skus'] });
    },
  });
};
